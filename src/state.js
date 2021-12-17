/**
 * User: yexiaolong/771388996@qq.com
 * Date: 2021/12/14
 * Time: 11:50 上午
 */
import {isFunction} from "./utils";
import {observe} from "./observe";

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}
/** 手动实现_data代理 **/
function Proxy(vm, key, source) { // 取值的时候做代理，不是暴力的把_data属性赋予给vm 直接赋值会有命名冲突问题
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newValue) {
            vm[source][key] = newValue
        }
    })
}

/** 数据的初始化 **/
function initData(vm) {
    console.log('数据的初始化操作')
    let data = vm.$options.data
    data = vm._data = isFunction(data) ? data.call(vm) : data // _data 已经是响应式的了
    // console.log(data)
    // 需要将data编程响应式的 object.defineProperty, 重写data中的所有属性
    observe(data) // 观测数据
    for(let key in data) { // vm.message => vm._data.message
        Proxy(vm, key, '_data')
    }
    console.log('data----> observe--end', data)
}
