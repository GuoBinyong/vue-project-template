import {XHeader} from 'vux';
import {parseButtonOptionsListFromVNodeList} from ':tools/VNode'


let agentMixin = {
  computed: {


    /**
     *
     * @return {{back: {hide: boolean, text: *}, preventBack: *, buttonOptionsList: *[]}}
     */
    navLeftOptions: function () {

      //props
      let {showBack, backText, preventGoBack} = this.leftOptions || {};
      let onClickBack = this.$listeners["on-click-back"];

      let backShow = showBack === false ? false : true;
      let back = {
        hide: !backShow,
        text: backText,
        click: onClickBack
      };

      // slot: overwrite-left
      let overwriteLeftVNodes = this.$slots.overwriteLeft;
      let owLeftSlotBtnOptionsList = null;
      if (overwriteLeftVNodes) {
        back.hide = true;
        owLeftSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(overwriteLeftVNodes);
      }


      //slot: overwrite-left
      let leftVNodes = this.$slots.left;
      let leftSlotBtnOptionsList = null;
      if (leftVNodes) {
        leftSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(leftVNodes);
      }


      let leftBtnOptionsList = null;

      if (owLeftSlotBtnOptionsList || leftSlotBtnOptionsList) {
        leftBtnOptionsList = [...owLeftSlotBtnOptionsList, ...leftSlotBtnOptionsList];
      }


      let leftOptions = {
        back: back,
        preventBack: preventGoBack,
        buttonOptionsList: leftBtnOptionsList
      };


      return leftOptions;

    },


    /**
     *
     * @return {{title: {hide: boolean, text: *, click: *}, buttonOptionsList: *}}
     */
    navTitleOptions: function () {
      let title = this.title;
      let onClickTitle = this.$listeners["on-click-title"];

      let titleBtnOptions = {
        hide: false,
        text: title,
        click: onClickTitle
      };

      let slotList = this.$slots;
      let titleVNodes = slotList.overwriteTitle || slotList.default;
      let titleSlotBtnOptionsList = null;
      if (titleVNodes) {
        titleBtnOptions.hide = true;
        titleSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(titleVNodes);
      }


      let titleOptions = {
        title: titleBtnOptions,
        buttonOptionsList: titleSlotBtnOptionsList
      };


      return titleOptions;


    },


    /**
     *
     * @return {{more: {hide: boolean, click: *}, buttonOptionsList: *}}
     */
    navRightOptions: function () {
      let showMore = this.rightOptions && this.rightOptions.showMore;

      let onClickMore = this.$listeners["on-click-more"];

      let moreBtnOptions = {
        hide: !showMore,
        click: onClickMore
      };

      let rightVNodes = this.$slots.right;
      let rightSlotBtnOptionsList = null;
      if (rightVNodes) {
        rightSlotBtnOptionsList = parseButtonOptionsListFromVNodeList(rightVNodes);
      }


      let rightOptions = {
        more: moreBtnOptions,
        buttonOptionsList: rightSlotBtnOptionsList
      };


      return rightOptions;
    },


    navBarOptions: function () {
      let leftOptions = this.navLeftOptions;
      let titleOptions = this.navTitleOptions;
      let rightOptions = this.navRightOptions;

      let navBarOptions = {
        left: leftOptions,
        title: titleOptions,
        right: rightOptions
      };

      return navBarOptions;
    }


  },


  watch: {
    navBarOptions: function (newVal, oldVal) {
      this.updateNavBarOptions(newVal);
    }
  },

  mounted: function () {
    this.updateNavBarOptions(this.navBarOptions);
  },

  activated:function(){
    this.updateNavBarOptions(this.navBarOptions);
  },

  methods: {
    updateNavBarOptions: function (newNavBarOptions) {
      shareInst.client.updateNavBarOptions(newNavBarOptions);
    }

  },


  created: function () {
    this.clientChangeHandle = () => {
      this.$forceUpdate();
      this.updateNavBarOptions(this.navBarOptions);
    };
    window.byAddEventListener("clientChange", this.clientChangeHandle);
  },
  beforeDestroy: function () {
    window.byRemoveEventListener("clientChange", this.clientChangeHandle);
  }


};


let xHeaderMixins = XHeader.mixins || [];

xHeaderMixins = xHeaderMixins.concat(agentMixin);

XHeader.mixins = xHeaderMixins;


let oriRender = XHeader.render;
XHeader.render = function (h) {
  return shareInst.client.showWebNavBar ? oriRender.call(this, h) : null;
}


export default XHeader;
