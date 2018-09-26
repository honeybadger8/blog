/*
* @authors :平头哥联盟-首席填坑官(苏南)
* @date    :2018-09-26
* @description：平头哥联盟项目示例源码,欢迎投稿讲出你的故事
* @github：https://honeybadger8.github.io/blog/
*/
class storage {

  constructor(props) {
    this.props = props || {}
    this.source =  wx||this.props.source;

  }

  get(key) {
    const data = this.source,
          timeout = (data.getStorageSync(`${key}__expires__`)||0)

    // 过期失效
    if (Date.now() >= timeout) {
      this.remove(key)
      return;
    }
    const value = data.getStorageSync(key)
    return value
  }

  // 设置缓存
  // timeout：过期时间（分钟）
  set(key, value, timeout) {
    let data = this.source
    let _timeout = timeout||120;
    data.setStorageSync(key,(value));
    data.setStorageSync(`${key}__expires__`,(Date.now() + 1000*60*_timeout));
    return value;
  }

  remove(key) {
    let data = this.source
        data.removeStorageSync(key)
        data.removeStorageSync(`${key}__expires__`)
    return undefined;
  }
}
module.exports = new storage();