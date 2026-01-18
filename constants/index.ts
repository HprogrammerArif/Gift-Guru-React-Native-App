import expenseBlack from "@/assets/images/tabIcon/expenseBlack.png";
import expenseWhite from "@/assets/images/tabIcon/expenseWhite.png";
import homeBlack from "@/assets/images/tabIcon/homeBlack.png";
import homeWhite from "@/assets/images/tabIcon/homeWhite.png";
import messageBlack from "@/assets/images/tabIcon/messageBlack.png";
import messageWhite from "@/assets/images/tabIcon/messageWhite.png";
import profileBlack from "@/assets/images/tabIcon/profileBlack.png";
import profileWhite from "@/assets/images/tabIcon/profileWhite.png";
import scheduleBlack from "@/assets/images/tabIcon/scheduleBlack.png";
import scheduleWhite from "@/assets/images/tabIcon/scheduleWhite.png";

import tabler_bulb from "@/assets/images/homeAsset/tabler_bulb.png";
import document from "@/assets/images/homeAsset/document.png";
import expenses from "@/assets/images/homeAsset/expenses.png";
import milestone from "@/assets/images/homeAsset/milestone.png";
import schedule from "@/assets/images/homeAsset/schedule.png";
import gg_time from "@/assets/images/homeAsset/gg_time.png";
import Ellipse from "@/assets/images/homeAsset/Ellipse.png";

import back from "@/assets/images/notifications/back.png";

import postLiked from "@/assets/icons/notification/postLiked.png";
import linkClick from "@/assets/icons/notification/linkClick.png";
import newComment from "@/assets/icons/notification/newComment.png";
import postApprove from "@/assets/icons/notification/postApprove.png";

export const homeAssets = {
  tabler_bulb,
  document,
  expenses,
  milestone,
  schedule,
  gg_time,
  Ellipse,
};

export const notificationIcons = {
  back,
  postLiked,
  linkClick,
  newComment,
  postApprove,
}

export const tabIcons = {
  expenseBlack,
  expenseWhite,
  homeBlack,
  homeWhite,
  messageBlack,
  messageWhite,
  profileBlack,
  profileWhite,
  scheduleBlack,
  scheduleWhite,
};

export const notificationTabs = [
  postLiked,
  linkClick,
  newComment,
  postApprove,
];

export type RECOMMENDED_DATA_TYPE = typeof RECOMMENDED_DATA;

export const RECOMMENDED_DATA = [
  {
    id: "1",
    title: "Precision Me..",
    likes: "124 liked",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "Wireless Hea..",
    likes: "89 liked",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    title: "Smart Watch",
    likes: "256 liked",
    image: "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    title: "Grocery",
    likes: "56 liked",
    image: "https://images.unsplash.com/photo-1615396899839-c99c121888b0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
 
  {
    id: "6",
    title: "Wireless Hea..",
    likes: "89 liked",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "7",
    title: "Smart Watch",
    likes: "256 liked",
    image: "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "8",
    title: "Grocery",
    likes: "56 liked",
    image: "https://images.unsplash.com/photo-1615396899839-c99c121888b0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
   {
    id: "9",
    title: "Wireless Hea..",
    likes: "89 liked",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "9",
    title: "Smart Watch",
    likes: "256 liked",
    image: "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export type TRENDING_DATA_TYPE = typeof TRENDING_DATA;

export const TRENDING_DATA = [
  {
    id: "1",
    title: "Ray-Ban Clas..",
    engagement: "124 engagement",
    image: "https://picsum.photos/400/400?random=10",
  },
  {
    id: "2",
    title: "Nike Air Ma..",
    engagement: "450 engagement",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    id: "3",
    title: "Polaroid Camera",
    engagement: "98 engagement",
    image: "https://picsum.photos/400/400?random=12",
  },
];

export const POSTS_DATA = [
  {
    id: "1",
    user: {
      name: "Buffalo High School",
      avatar: "https://i.pravatar.cc/150?u=buffalo",
      date: "12 APR 09:28 PM",
    },
    title: "Precision Mechanical Keyboard",
    description:
      "Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended.",
    postImage: "https://picsum.photos/600/400?random=20",
    likes: 124,
    comments: 62,
  },
  {
    id: "2",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  },
  {
    id: "3",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  },
  {
    id: "4",
    user: {
      name: "Buffalo High School",
      avatar: "https://i.pravatar.cc/150?u=buffalo",
      date: "12 APR 09:28 PM",
    },
    title: "Precision Mechanical Keyboard",
    description:
      "Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended.",
    postImage: "https://picsum.photos/600/400?random=20",
    likes: 124,
    comments: 62,
  },
  {
    id: "5",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  },
  {
    id: "6",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  },
  {
    id: "7",
    user: {
      name: "Buffalo High School",
      avatar: "https://i.pravatar.cc/150?u=buffalo",
      date: "12 APR 09:28 PM",
    },
    title: "Precision Mechanical Keyboard",
    description:
      "Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended Perfect for the office or home setup. Tactile, quiet, and beautiful backlight. Recommended Recommended.",
    postImage: "https://picsum.photos/600/400?random=20",
    likes: 124,
    comments: 62,
  },
  {
    id: "8",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  },
  {
    id: "9",
    user: {
      name: "Tech Geek",
      avatar: "https://i.pravatar.cc/150?u=tech",
      date: "14 APR 10:00 AM",
    },
    title: "Next Gen VR Headset",
    description:
      "Experience reality like never before. The most immersive technology of the decade is finally here.",
    postImage: "https://picsum.photos/600/400?random=21",
    likes: 850,
    comments: 120,
  }
];



// export const onboarding = [
//   {
//     id: 1,
//     title: "Secure Messaging",
//     description: "Communicate clearly and respectfully in one place.",
//     image: images.onboarding1,
//   },
//   {
//     id: 2,
//     title: "Shared Calendar",
//     description: "Stay in sync with shared  schedules and appointments.",
//     image: images.onboarding2,
//   },
//   {
//     id: 3,
//     title: "Expense Tracking",
//     description: "Manage and track shared expenses.",
//     image: images.onboarding3,
//   },
// ];
