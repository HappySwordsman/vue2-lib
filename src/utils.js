/**
 * User: yexiaolong/771388996@qq.com
 * Date: 2021/12/14
 * Time: 4:47 下午
 */
export function isFunction(val) {
    return typeof val === 'function'
}
export function isObject(val)  {
    return typeof val === 'object' && val !== null
}
export function isArray(data) {
    return Array.isArray(data)
}
