import React from 'react';
import * as API from './encode';


const TARGET_DATA: InputRowData = {
  label: "Destination URL",
  description: "The URL that you want the user to be redirected to",
  checkForErrors: API.checkUrlForErrors,
}

const TEMPLATE_DATA: InputRowData = {
  label: "Template",
  description: "The template can be used to mislead the person viewing the link into believing that it has a different purpose (for example to disguise it as an unsubscribe link)",
  checkForErrors: API.checkTemplateForErrors,
}

const SERVER_DATA: InputRowData = {
  label: "Redirect page URL",
  description: "The URL where your server hosts your redirect page",
  checkForErrors: API.checkUrlForErrors,
}

export default class CreateLinkView extends React.Component<Props> {
  render() {
    const template = this.props.data.page + this.props.data.template;
    const link = API.createRedirectUrl(template, this.props.data.url).url;

    return (
      <div className="create-link-root">
        {this.renderInputRow(TARGET_DATA, "url")}
        {this.renderInputRow(TEMPLATE_DATA, "template")}
        {this.renderInputRow(SERVER_DATA, "page")}
        <h2>Your link is</h2>
        <div className="link-div">
          <a target="_blank" rel="noopener noreferrer" href={link}>
            {link}
          </a>
        </div>
      </div>
    );
  }

  renderInputRow(rowData: InputRowData, field: string) {
    let value = this.props.data[field];
    let onValueChange = (e: any) => {
      let copy: TextFieldValues = { ...this.props.data };
      copy[field] = e.target.value;
      this.props.setData(copy);
    };

    let error = rowData.checkForErrors(value);
    let inputClass = error ? "error" : undefined;
    return <div>
      <div className="input-row">
        <div className="label">{rowData.label}</div>
        <div className="input">
          <input className={inputClass} title={rowData.description} type="text" onChange={onValueChange} value={value} />
        </div>
      </div>
      {error ? <div className="err-msg">{error}</div> : null}
    </div >;
  }
}

interface InputRowData {
  label: string,
  description: string,
  checkForErrors: (value: string) => string,
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
