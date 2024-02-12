import cluster from 'cluster';
import http, { IncomingMessage as Req, ServerResponse as Res } from 'http';
import { availableParallelism } from 'os';
import 'dotenv/config';

import { User } from './models/User.model';
import { shareUpdateUsers } from './services/users.service';
import { routeHandler } from './routes/routes';
import { handleRequest } from './helpers/helpers';

const PORT: number = +process.env.PORT! || 4000;
const NUM_CPUS: number = availableParallelism() - 1;

const primaryClusterActions = () => {
    for (let i = 0; i < NUM_CPUS; i++) {
        const workerPort: string = (PORT + i + 1).toString();

        cluster.fork({ WORKER_PORT: workerPort });
    }

    Object.values(cluster.workers!)
        .forEach((worker) => {
            worker!.on('message', (message) => {
                if (message.type === 'updateUsers') {
                    Object.values(cluster.workers!)
                        .filter((otherWorker) => otherWorker !== worker)
                        .forEach((otherWorker) => otherWorker!.send(message));
                }
            });
        });

    let roundRobinIndex = 0;

    const workerPorts: number[] = Array.from({ length: NUM_CPUS }, (_, index) => PORT + index + 1);
    http.createServer((req: Req, res: Res) => {
            const workerPort: number = workerPorts[roundRobinIndex++ % NUM_CPUS];
            handleRequest(workerPort, req, res);
        })
        .listen(PORT, () => {
            console.log(`Load Balancer is running on port ${PORT}`);
        });
};

const workerClusterActions = () => {
    const port: number = +process.env.WORKER_PORT!;
    if (port) {
        http.createServer((req: Req, res: Res ) => routeHandler(req, res))
            .listen(port, () => {
                console.log(`Worker ${process.pid} is running on port ${port}`);
            });
    }

    process.on('message', (message: {type: string, data: User[]}) => {
        if (message.type === 'updateUsers') {
            shareUpdateUsers(message.data);
        }
    });
};

const runBalancer = () => {
    if (NUM_CPUS <= 0) {
        console.log('Insufficient available CPUs to run application in this mode.');
        process.exit(1);
    }

    cluster.isPrimary
        ? primaryClusterActions()
        : workerClusterActions();
};

runBalancer();
