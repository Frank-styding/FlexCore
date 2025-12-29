import { Button, ButtonEventsType, ButtonType } from "./Button";
import { Layout, LayoutType } from "./Layout";
import { ConfirmModal, ConfirmModalType } from "./ConfirmModal";
import { ComponentType } from "./Component";
import { Gallery, GalleryEventsType, GalleryType } from "./Gallery";
import { Navigation, NavigationEventsType, NavigationType } from "./Navigation";

export const ComponentsBuilders = {
  Button,
  ConfirmModal,
  Layout,
  Gallery,
  Navigation,
};

export const ComponentsTypes = [
  ComponentType,
  ButtonType,
  LayoutType,
  ConfirmModalType,
  GalleryType,
  NavigationType,
];

export const ComponentEventsTypes = [
  ButtonEventsType,
  GalleryEventsType,
  NavigationEventsType,
];
