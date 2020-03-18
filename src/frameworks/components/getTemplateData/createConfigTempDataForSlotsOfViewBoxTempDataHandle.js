import {configTemplateDataForVNodes} from ':tools/VNode'





/**
 * 创建 configTempDataForSlotsOfViewBox
 * @param tempDatas : {header : TempData  header 的模板数据,bottom : TempData  bottom 的模板数据}
 *
 * @property tempDatas.header : TempData   header 的模板数据
 * @property tempDatas.bottom : TempData   bottom 的模板数据
 * @returns getTemplateDataHandle
 *
 * configTempDataForSlotsOfViewBox
 * 当 ByViewBox 的 header 和 bottom 都只有一个时，给 ByViewBox 的 header 和 bottom slots 配置 模板数据
 */
export default function createConfigTempDataForSlotsOfViewBoxTempDataHandle({header:headerTempData,bottom:bottomTempData}) {


  /**
   * 当 ByViewBox 的 header 和 bottom 都只有一个时，给 ByViewBox 的 header 和 bottom slots 配置 模板数据
   */
  let configTempDataForSlotsOfViewBox = function (templateData,vbInstance,createElement) {

    let {props = {...vbInstance.$attrs},slots = vbInstance.$slots} = templateData || {} ;
    let {header,bottom} = slots;

    //给header添加css类
    let oneHeader = header && header.length == 1 ;
    if (headerTempData && oneHeader) {
      let headerVN = header[0];
      headerVN = configTemplateDataForVNodes(headerVN,headerTempData)
      header[0] = headerVN ;
      slots.header = header ;
    }



    //给bottom添加css类
    let oneBottom = bottom && bottom.length == 1 ;
    if (bottomTempData && oneBottom) {
      let bottomVN = bottom[0];
      bottomVN = configTemplateDataForVNodes(bottomVN,bottomTempData)
      bottom[0] = bottomVN ;
      slots.bottom = bottom ;
    }


    return {slots,props};
  }


  return configTempDataForSlotsOfViewBox;
}








