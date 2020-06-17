import React from 'react';
import * as Encoder from './Encoder';
import FieldEditView, { RowDescription } from './FieldEditView';

const TARGET_DATA: RowDescription = {
  label: "Destination URL",
  description: "The URL that you want the user to be redirected to",
  checkForErrors: Encoder.checkUrlForErrors,
  fieldName: "url",
}

const TEMPLATE_DATA: RowDescription = {
  label: "Template",
  description: "The template can be used to mislead the person viewing the link " +
    "into believing that it has a different purpose (for example to disguise it as an unsubscribe link)",
  checkForErrors: Encoder.checkTemplateForErrors,
  fieldName: "template",
}

const SERVER_DATA: RowDescription = {
  label: "Redirect page URL",
  description: "The URL where your server hosts your redirect page",
  checkForErrors: Encoder.checkUrlForErrors,
  fieldName: "page",
}

export default class CreateLinkView extends React.Component<Props> {
  render() {
    const template = this.props.data.page + this.props.data.template;
    const link = Encoder.createRedirectUrl(template, this.props.data.url).url;

    return (
      <div className="create-link-root">
        <FieldEditView data={this.props.data} setData={this.props.setData} row={TARGET_DATA} />
        <FieldEditView data={this.props.data} setData={this.props.setData} row={TEMPLATE_DATA} />
        <FieldEditView data={this.props.data} setData={this.props.setData} row={SERVER_DATA} />
        <h2>Your link is</h2>
        <div className="link-div">
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {link}
          </a>
        </div>
      </div>
    );
  }
}

interface Props {
  data: TextFieldValues,
  setData: (newData: TextFieldValues) => void,
}

export interface TextFieldValues {
  url: string,
  template: string,
  page: string,
  [key: string]: string,//to allow property access using square brackets like in JS
}
