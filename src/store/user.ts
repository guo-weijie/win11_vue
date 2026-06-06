import { defineStore } from "pinia";

interface stateType {
  userName: string;
  userAvatar: string;
  backgroundImgUrl: string;
  theme: string;
}

const userStore = defineStore("user-store", {
  state: (): stateType => {
    return {
      userName: "Administrator",
      userAvatar: "defAccount",
      backgroundImgUrl: "/default/img0.jpg",
      theme: "default",
    };
  },
  getters: {
    getUserName(): string {
      return this.userName;
    },
    getUserAvatar(): string {
      return this.userAvatar;
    },
    getBackgroundImgUrl(): string {
      return this.backgroundImgUrl;
    },
    getTheme(): string {
      return this.theme;
    },
  },
  actions: {
    changeUserName(userName: string) {
      this.userName = userName;
    },
    changeUserAvatar(url: string) {
      this.userAvatar = url;
    },
    changeBackgroundImgUrl(url: string) {
      this.backgroundImgUrl = url;
    },
    changeTheme(name: string) {
      this.theme = name;
    },
  },
});

export { userStore };
