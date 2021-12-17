/**
 * User: yexiaolong/771388996@qq.com
 * Date: 2021/12/14
 * Time: 9:31 上午
 */
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
export default {
    input: './src/index.js',
    output: {
        file: 'dist/vue.js',
        format: 'umd',
        name: 'Vue',
        sourcemap: true
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),

    ]
}
