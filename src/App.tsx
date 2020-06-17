import React from 'react';
import './App.scss';
import * as API from './encode';
import * as Decode from './decode';

// TODOs
// Add a tutorial / instructions
// Make it look nice [partial]
// Allow signing links?
// Add debugging features
// Add (more) templates [partial]
// Add this to my projects page. Write about stateless web apps on my projects page

//Import test link: https://projects.six-two.dev/react_redirect/follow#LNKaHR0cHM6Ly9leGFtcGxlLm9yZw

export default class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      url: "https://example.com",
      template: randomChoice(TEMPLATES),
      page: "https://projects.six-two.dev/react_redirect/follow.html",
    }
  }

  render() {
    const template = this.state.page + this.state.template;
    const link = API.createRedirectUrl(template, this.state.url).url;

    return (
      <div className="App">
        <h1>Create a (deceptive) redirect link</h1>
        {this.renderInputRow(TARGET_DATA, this.state.url, (e: any) => this.setState({ url: e.target.value }))}
        {this.renderInputRow(TEMPLATE_DATA, this.state.template, (e: any) => this.setState({ template: e.target.value }))}
        {this.renderInputRow(SERVER_DATA, this.state.page, (e: any) => this.setState({ page: e.target.value }))}
        <div className="import-div">
          <button onClick={this.showImportDialog}>
            Import from URL
        </button>
        </div>
        <h2>Your link is</h2>
        <a target="_blank" rel="noopener noreferrer" href={link}>{link}</a>
      </div>
    );
  }

  renderInputRow(rowData: InputRowData, value: string, onValueChange: (e: any) => void) {
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
    </div>;
  }

  showImportDialog = () => {
    let url = window.prompt("Input the URL to import the data from");
    if (url) {
      try {
        let redirectUrl = Decode.findRedirect(new URL(url));
        if (!redirectUrl) {
          alert("Your URL does not contain an embedded redirect link");
          return;
        }
        let encoded = API.createRedirectUrl("%s", redirectUrl).url;//ignore errors
        let template = url.replace(encoded, "%s");
        let [page, params] = splitUrlIntoPageAndParams(template);
        this.setState({ page: page, template: params, url: redirectUrl });
      } catch (e) {
        console.error("Error importing URL:", url, "\n", e);
        alert("An error occured while importing the URL. Are you sure it is valid?");
      }
    }
  }
}

function splitUrlIntoPageAndParams(url: string): [string, string] {
  let parts = url.split("?", 2);
  if (parts.length === 2) {
    return [parts[0], "?" + parts[1]]
  } else {
    parts = url.split("#", 2);
    if (parts.length === 2) {
      return [parts[0], "#" + parts[1]]
    }
  }
  // has no params
  return [url, ""];
}


const TEMPLATES = [
  "#type=email&action=unsubscribe&userId=%s&campaign=Summer2020",
  "#target=www.youtube.com&video=%s",
  "#shop=www.amazon.com&productId=B00V155S46&couponCode=%s",
];

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

function randomChoice<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

interface State {
  url: string,
  template: string,
  page: string,
}

interface InputRowData {
  label: string,
  description: string,
  checkForErrors: (value: string) => string,
}
