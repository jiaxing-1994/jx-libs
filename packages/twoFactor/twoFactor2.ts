import Vue from "vue";
import WkHttp from "../http";
import TwoFactorfor2 from "./twoFactorfor2.vue";
import Notification from "./components/notification.vue";

class TwoFactor2 {
  public twoFactorInstance: any;
  public parentDom: HTMLElement;
  public noticeInstance: any;
  private id: string;
  private noticeId: string;
  private propsData: Record<string, any>;
  private http: WkHttp;
  private hasSensitive: boolean;
  private type: number; // 1:敏感数据 2:敏感操作
  private props: Record<string, any>; // 组件属性
  private urlListenerEvent: (remove?: boolean) => void;
  private bodyListenerEvent: (remove?: boolean) => void;
  private options: {
    baseUrl: string;
    timeout: number;
    dataStatus: number; // 敏感数据状态码
    operationStatus: number; // 敏感操作状态码
  };

  /**
   *
   * @param options 参数
   * @param propsData modal框属性
   * @param dom 挂在元素 默认body
   */
  constructor(
    options: Record<string, any> = {},
    propsData: Record<string, any> = {},
    dom: HTMLElement = document.body
  ) {
    this.twoFactorInstance = null;
    this.noticeInstance = null;
    this.parentDom = dom;
    this.id = "twoFactor";
    this.noticeId = "twoFactorNotice";
    this.propsData = propsData;
    this.hasSensitive = false; // 是否有敏感数据
    this.options = {
      baseUrl: "",
      timeout: 10000,
      dataStatus: 203,
      operationStatus: 423,
      ...options,
    };
    this.props = {
      msg: "",
      token: "",
      projectId: "",
      type: 1,
    };
    this.http = new WkHttp({
      baseUrl: this.options.baseUrl,
      timeout: this.options.timeout,
    });
    this.type = 1;
    this.urlListenerEvent = this.urlChangeListener();
    this.bodyListenerEvent = this.bodyClickListener();
  }

  bodyClickListener() {
    const clickEventFn = (e: MouseEvent) => {
      const innerText = (e.target as HTMLElement).innerText.replace(/\s/g, "");
      if (["编辑"].includes(innerText)) {
        this.openModal({
          ...this.props,
          type: 3,
        });
      }
    };
    return (remove = false) => {
      if (remove) {
        document.body.removeEventListener("click", clickEventFn); // 移除body点击监听
      } else {
        document.body.addEventListener("click", clickEventFn); // 添加body点击监听
      }
    };
  }

  /**
   * 监听url变换，如果url改变了并且有双因子弹窗，则关闭弹窗
   * 支持hash和history两种模式
   */
  urlChangeListener() {
    const urlChangeFn = () => {
      this.bodyListenerEvent(true);
      this.closeModal(); // 关闭双因子弹窗
      this.closeNotice(); // 关闭双因子提醒
      this.urlListenerEvent(true); // 移除url变化监听
    };
    return (remove = false) => {
      if (remove) {
        window.removeEventListener("popstate", urlChangeFn);
        window.removeEventListener("hashchange", urlChangeFn);
      } else {
        window.addEventListener("popstate", urlChangeFn);
        window.addEventListener("hashchange", urlChangeFn);
      }
    };
  }

  /**
   * 打开双因子
   * @param status 当前状态码
   * @param token 授权码
   * @param projectId 项目id 后端返回
   * @param msg 提示信息
   */
  open(status: number, token: string, projectId: string, msg = "") {
    this.hasSensitive = false;
    this.urlListenerEvent();
    this.bodyListenerEvent();
    this.props = {
      msg,
      token,
      projectId,
      type: this.type,
    };
    switch (status) {
      case this.options.dataStatus:
        this.type = 1;
        this.hasSensitive = true;
        this.openNotice(this.props);
        break; // 敏感数据
      case this.options.operationStatus:
        this.type = 2;
        this.openModal(this.props);
        break; // 敏感操作
      default:
        break;
    }
  }

  /**
   * 创建notice实例
   * @param propsData notice组件属性
   */
  createNoticeInstance(propsData: Record<string, any> = {}) {
    const notificationConstructor = Vue.extend(Notification);
    this.noticeInstance = new notificationConstructor({
      propsData,
    });
    this.noticeInstance.$on("goVerify", () => {
      // 打开验证弹窗
      this.closeNotice();
      this.openModal(propsData);
    });
    this.noticeInstance.$on("close", () => {
      // 关闭notice框
      this.closeNotice();
    });
  }

  /**
   * 创建notice挂载元素
   */
  createNoticeDom() {
    if (!document.getElementById(this.noticeId)) {
      const dom = document.createElement("div");
      dom.id = this.noticeId;
      this.parentDom.appendChild(dom);
      this.parentDom.style.position = "relative";
    }
  }

  /**
   * 打开notice
   * @param propsData notice组件属性
   */
  openNotice(propsData?: Record<string, any>) {
    // 如果页面上notice组件或者验证弹窗组件，则直接返回，防止多次弹出
    if (
      (this.noticeInstance && this.noticeInstance.$el) ||
      (this.twoFactorInstance && this.twoFactorInstance.$el) ||
      document.getElementById("twoFactorNotice") ||
      document.getElementById("twoFactorModal")
    ) {
      return;
    }
    if (!this.noticeInstance) {
      this.createNoticeInstance(propsData);
    }
    this.createNoticeDom();
    this.noticeInstance.$mount(`#${this.noticeId}`);
  }

  /**
   * 关闭notice窗口
   */
  closeNotice() {
    if (this.noticeInstance) {
      document.body.removeChild(this.noticeInstance.$el);
      this.noticeInstance.$destroy();
      this.noticeInstance = null;
    }
  }

  /**
   * 打开验证弹窗
   * @param propsData 验证弹窗实例
   */
  createModalInstance(propsData: Record<string, any> = this.propsData) {
    // @ts-ignore
    const twoFactorConstructor = Vue.extend(TwoFactorfor2);
    this.twoFactorInstance = new twoFactorConstructor({
      propsData: {
        ...propsData,
        http: this.http,
      },
    });
  }

  /**
   * 创建弹窗挂载元素
   */
  createModalDom() {
    if (!document.getElementById(this.id)) {
      const dom = document.createElement("div");
      dom.id = this.id;
      this.parentDom.appendChild(dom);
      this.parentDom.style.position = "relative";
    }
  }

  /**
   * 打开弹窗
   * @param propsData 弹窗组件属性
   */
  openModal(propsData?: Record<string, any>) {
    // 如果页面上验证弹窗，则直接返回，防止多次弹出
    if (
      (this.twoFactorInstance && this.twoFactorInstance.$el) ||
      document.getElementById("twoFactorModal")
    ) {
      return;
    }
    // 如果页面上有notice组件，则直接关闭
    if (
      (this.noticeInstance && this.noticeInstance.$el) ||
      document.getElementById("twoFactorNotice")
    ) {
      this.closeNotice();
    }
    if (!this.twoFactorInstance) {
      this.createModalInstance(propsData);
    }
    this.createModalDom();
    this.twoFactorInstance.$mount(`#${this.id}`);
    this.twoFactorInstance.$on("verified", () => {
      this.closeModal();
    });
    this.twoFactorInstance.$on("close", () => {
      // 关闭弹窗
      this.closeModal();
    });
  }

  /**
   * 关闭弹窗
   */
  closeModal() {
    if (this.twoFactorInstance) {
      document.body.removeChild(this.twoFactorInstance.$el);
      this.twoFactorInstance.$destroy();
      this.twoFactorInstance = null;
    }
  }
}

export default TwoFactor2;
