/**
 * 自动显示ViewBox的Header
 * 定制 Vux 的 ViewBox 组件 的 getTemplateDataHandle，使其能根据 client.showWebNavBar 和  自身是否有 header 插槽来动态决定 Vux的ViewBox的 body-padding-top 是否需要设置为 0 ；这样便不用每次使用都要单独定制了
 *
 * 备注：
 * 该 getTemplateDataHandle 会在 返回的 templateData 中用 noHeader (即：templateData.noHeader) 标识否有 header
 */
/*export default function autoDisplayHeader(templateData,vbInstance,createElement) {

  let {props = {...vbInstance.$attrs},slots = vbInstance.$slots} = templateData || {} ;
  let headerSlots = slots.header;
  let needHideWebNavBar = !(shareInst.client.showWebNavBar && headerSlots);

  if (needHideWebNavBar) {
    props.bodyPaddingTop = "0" ;
  }


  let noHeader = needHideWebNavBar || !headerSlots || headerSlots.length <= 0 ;

  return {props:props,noHeader:noHeader};
}*/




/**
 * 自动显示ViewBox的Header 的创建者
 * 定制 Vux 的 ViewBox 组件 的 getTemplateDataHandle，使其能根据 client.showWebNavBar 和  自身是否有 header 插槽来动态决定 Vux的ViewBox的 body-padding-top 是否需要设置为 0 ；这样便不用每次使用都要单独定制了
 * @param navBarHeight ? : string     可选；导航条的高度
 * @param headerHeight ? : string     可选；默认值是 navBarHeight ; ViewBox的Header 的高度
 *
 *
 * 备注：
 * 该 getTemplateDataHandle 会在 返回的 templateData 中用 noHeader (即：templateData.noHeader) 标识否有 header
 */
export default function createAutoDisplayHeaderTempDataHandle({navBarHeight,headerHeight}={}) {
  var formatObjects = [{caseType:"N"},{separator:"-",caseType:"L"},{separator:"-",caseType:"U"},{separator:"-",caseType:"N"}];


  var autoDisplayHeader = function autoDisplayHeader(templateData,vbInstance,createElement) {

    let {props = {...vbInstance.$attrs},slots = vbInstance.$slots} = templateData || {} ;
    let headerSlots = slots.header;
    let needHideWebNavBar = !(shareInst.client.showWebNavBar && headerSlots);


    //导航条的高度
    let finalNavBarHeight = props.findValueForKeyFormats("navBarHeight",formatObjects);
    if (finalNavBarHeight == null) {
      finalNavBarHeight = navBarHeight;
    }


    if  (!headerHeight){
      headerHeight = navBarHeight;
    }
    let finalHeaderHeight = props.findValueForKeyFormats("headerHeight",formatObjects);
    if (finalHeaderHeight == null) {
      finalHeaderHeight = finalNavBarHeight;
    }



    if (needHideWebNavBar) {

      let bodyPaddingTop = props.findValueForKeyFormats("bodyPaddingTop",formatObjects) ;
      if (bodyPaddingTop && finalNavBarHeight && bodyPaddingTop.length > 1) {
        bodyPaddingTop = `calc( ${bodyPaddingTop} - ${finalNavBarHeight} )`
      }else {
        bodyPaddingTop = "0" ;
      }
      props.bodyPaddingTop = bodyPaddingTop;



      if (finalHeaderHeight && finalHeaderHeight.length > 1) {
        finalHeaderHeight = `calc( ${finalHeaderHeight} - ${finalNavBarHeight} )`
      }else {
        finalHeaderHeight = "0" ;
      }
      props.headerHeight = finalHeaderHeight;


    }


    let noHeader = needHideWebNavBar || !headerSlots || headerSlots.length <= 0 ;

    return {props:props,noHeader:noHeader};
  }


  return autoDisplayHeader;

}
