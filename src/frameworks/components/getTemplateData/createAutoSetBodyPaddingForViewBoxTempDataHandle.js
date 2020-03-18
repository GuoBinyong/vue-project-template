

/**
 * 自动给ViewBox配置bodyPadding getTemplateDataHandle 函数的创建者
 * @param paddingOptions : {paddingTop : string,paddingBottom : string}  配置 ViewBox 主体padding的配置对象
 * @property paddingOptions.paddingTop : string    ViewBox 主体的padding-top值，当顶部存在x-header等absolute定位元素时需要设置
 * @property paddingOptions.paddingBottom : string    ViewBox 主体的padding-bottom值，当底部存在tabbar等absolute定位元素时需要设置
 *
 *
 * autoSetBodyPaddingForViewBox 作用：
 * 当 有 header 且 没有设置 bodyPaddingTop 时，会自动设置 ViewBox 的 bodyPaddingTop 为 paddingTop
 * 当 有 bottom 且 没有设置 bodyPaddingBottom 时，会自动设置 ViewBox 的 bodyPaddingBottom 为 paddingBottom
 *
 */
export default function createAutoSetBodyPaddingForViewBoxTempDataHandle({paddingTop,paddingBottom}) {


  /**
   * 当 有 header 且 没有设置 bodyPaddingTop 时，会自动设置 ViewBox 的 bodyPaddingTop 为 paddingTop
   * 当 有 bottom 且 没有设置 bodyPaddingBottom 时，会自动设置 ViewBox 的 bodyPaddingBottom 为 paddingBottom
   */
  const autoSetBodyPaddingForViewBox = function (templateData,vbInstance,createElement){

    let {props = {...vbInstance.$attrs},slots = vbInstance.$slots} = templateData || {} ;
    let {header,bottom} = slots;

    let formatObjects = [{caseType:"N"},{separator:"-",caseType:"L"},{separator:"-",caseType:"U"},{separator:"-",caseType:"N"}];


    let haveHeader = header && header.length > 0 ;
    let bodyPaddingTop = props.findValueForKeyFormats("bodyPaddingTop",formatObjects) ;
    if (paddingTop && haveHeader && !bodyPaddingTop && !templateData.noHeader) {
      props.bodyPaddingTop = paddingTop ;
    }


    let haveBottom = bottom && bottom.length > 0 ;
    let bodyPaddingBottom = props.findValueForKeyFormats("bodyPaddingBottom",formatObjects) ;

    if (paddingBottom && haveBottom && !bodyPaddingBottom){
      props.bodyPaddingBottom = paddingBottom ;
    }


  };


  return autoSetBodyPaddingForViewBox ;

}


