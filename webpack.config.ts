import { resolve } from 'path';

export default {
    mode: "production",
    entry: './src/index.ts',
    target: 'node',
    externals: ['node_modules'],
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
