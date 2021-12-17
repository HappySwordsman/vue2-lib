/**
 * User: yexiaolong/771388996@qq.com
 * Date: 2021/12/14
 * Time: 4:51 下午
 */
import {isArray, isObject} from "../utils";
import {arrayMethods} from "./array";

class Observer {
    constructor(value) {
        // 如果 value.__ob__ = this 则在walk进行对象属性观测时候会进行套路 内存溢出
        Object.defineProperty(value, '__ob__',{
            value: this, // 我给对象和数组添加一个自定义属性
            enumerable: false // 这个属性不能被枚举 (不可以被循环到)
        })
        if(isArray(value)) {
            // 更改数组原型方法
            value.__proto__ = arrayMethods // 重写数组的方法
            // 如果存在数组中套数组或者对象，则还是需要递归劫持
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }
    /** 核心就是循环对象 **/
    walk(data) {
        Object.keys(data).forEach(key => { // 要使用defineProperty重新定义
           defineReactive(data, key, data[key])
        })
    }
    /** 递归遍历数组，对数组内部的对象再次重写 [[]]、[{}] **/
    observeArray(data) {
        data.forEach(item => observe(item)) // 数组里面如果引用类型那么是响应式的
    }
}

/**
 * vue2的性能瓶颈 慢的原因 主要在这个方法中 需要一加载的时候 就进行递归操作 所以耗性能，如果层次过深也会浪费性能
 * 1.性能优化的原则
 * 1) 不要把所有的数据都放在data中，因为所有的数据都会增加get和set
 * 2) 不要写数据的时候层次过深， 尽量扁平化数据
 * 3) 不要频繁获取数据
 * 4) 如果数据不需要响应式 可以使用Object.freeze 冻结属性
 **/
function defineReactive(obj, key, value) {
    observe(value) // 不管有多少层 我都进行defineReactive
    Object.defineProperty(obj, key, {
        get() {
            return value // 闭包, 次value会像上层的value进行查找
        },
        set(newValue) {
            if (newValue === value) return
            console.log('赋值了')
            value = newValue
            // 注意: 如果这里对象是直接进行赋值的 类似 vm.message = { b: 200 }, 那么新对象需要重新进行响应式赋值观测
            observe(newValue)
        }
    })
}

export function observe(value) {
    console.log('observe->value', value)
    // 1.如果value不是对象，那么就不用观测了，说明写的有问题
    if(!isObject(value)) return

    if(value.__ob__) {
        return // 一个被标记的对象不需要重复被观测
    }
    // 需要对对象进行观测(最外层必须是一个{} 不能是数组)
    // 如果一个数据已经被观测过了，就不要再进行观测了， 用类来实现，我观测过就增加一个标识 说明观测过了，
    // 再观测的时候 可以先检测是否观测过，如果观测过了就跳过检测
    return new Observer(value)
}
