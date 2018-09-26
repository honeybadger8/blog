/*
* @authors :平头哥联盟-首席填坑官(苏南)
* @date    :2018-09-26
* @description：平头哥联盟项目示例源码,欢迎投稿讲出你的故事
* @github：https://honeybadger8.github.io/blog/
*/

 
import dev from './env/dev'; //本地或开发
import uat from './env/pre'; //体验环境
import prd from './env/prd'; //线上


var ENV = "dev"; //'dev | uat | prd';
let _base_ = {
  dev,
  uat,
  prd
}[ENV];
var config = {
    ENV,
    baseAPI:{..._base_, env : ENV },
    isAuthorization:true,
    'logId': 'gV**DSMHNSRG**OTb-gz**GzoHsz',
    'logKey': 'pxFOg**Ed**Jn3JyjOVr',
};
export const __DEBUG__ = (ENV!="prd");
export default  config;
