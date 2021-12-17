/**
 * User: yexiaolong/771388996@qq.com
 * Date: 2021/12/14
 * Time: 5:43 下午
 */
let oldArrayPrototype = Array.prototype // 获取数组的老的原型方法

export let arrayMethods = Object.create(oldArrayPrototype) // 让arrayMethods 通过__proto__能获取到数组的方法

let methods = [ // 只有这七个方法 可以导致数组发生变化
    'push',
    'shift',
    'pop',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('数组的方法进行重写操作')
        // 数组新增的属性，要看下一是不是对象 如果是对象 继续进行劫持
        // 需要调用数组原生逻辑
        oldArrayPrototype[method].call(this, ...args)
        // todo... 可以添加自己逻辑
        let inserted = null // 收集splice插入的元素
        let ob = this.__ob__
        switch (method) {
            case 'splice': // 修改 删除 添加-arr.splice(0, 0, 100)
                inserted = args.slice(2) // splice方法从第三个参数起是增添的新数据
                break;
            case 'push':
            case 'unshift':
                inserted = args  // 调用 push 和 unshift 传递的参数就是新增的逻辑
                break;
        }
        // inserted[] 遍历数组 看一下他是否需要进行二次检测 但是当前拿不到observeArray方法，
        // 所以需要通过一些属性可以获取到observe方法对后续新增进来的数据进行观测
        if (inserted) {
            ob.observeArray(inserted)
        }
    }
})
