interface IComponent {
  id: string;
  name: string;
  sqlScript: string;
  jsScript: string;
  path: string;
  subPath?: IComponent;
}
