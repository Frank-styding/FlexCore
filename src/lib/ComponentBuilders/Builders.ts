import { Button, ButtonEventsType, ButtonType } from "./Button";
import { Layout, LayoutType } from "./Layout";
import { ConfirmModal, ConfirmModalType } from "./ConfirmModal";
import { ComponentType } from "./Component";
import { Gallery, GalleryEventsType, GalleryType } from "./Gallery";
import { Navigation, NavigationEventsType, NavigationType } from "./Navigation";
import { Table, TableEventsType, TableType } from "./Table";
import { CText, TextEventsType, TextType } from "./Text";
import { LoadingModal, LoadingModalType } from "./LoaddingModal";
import { FormModal, FormModalType } from "./FormModal";
import { Fragment, FragmentType } from "./Fragment";
import { Form, FormType } from "./Form";

export const ComponentsBuilders = {
  Button,
  ConfirmModal,
  Layout,
  Gallery,
  Navigation,
  Table,
  CText,
  LoadingModal,
  FormModal,
  Fragment,
  Form,
};

export const ComponentsTypes = [
  ComponentType,
  ButtonType,
  LayoutType,
  ConfirmModalType,
  GalleryType,
  NavigationType,
  TableType,
  TextType,
  LoadingModalType,
  FormModalType,
  FragmentType,
  FormType,
];

export const ComponentEventsTypes = [
  ButtonEventsType,
  GalleryEventsType,
  NavigationEventsType,
  TableEventsType,
  TextEventsType,
];
