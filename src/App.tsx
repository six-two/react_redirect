import React from 'react';
import './App.scss';

// TODOs
// Add a tutorial / instructions
// Make it look nice [partial]
// Allow signing links?
// Add debugging features
// Add (more) templates [partial]
// Add this to my projects page. Write about stateless web apps on my projects page

const TEMPLATES = [
  "#type=email&action=unsubscribe&userId=%s&campaign=Summer2020",
  "#target=www.youtube.com&video=%s",
  "#shop=www.amazon.com&productId=B00V155S46&couponCode=%s",
];



function randomChoice<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      url: "https://example.com",
      template: randomChoice(TEMPLATES),
      page: "https://projects.six-two.dev/react_redirect/follow.html",
    }
  }

  render() {
    const encoded = "LNK" + this.uriSafeEncode(this.state.url);
    const params = this.state.template.replace("%s", encoded);
    const link = this.state.page + params;

    return (
      <div className="App">
        <h1>Create a (deceptive) redirect link</h1>
        {this.renderInputRow(TARGET_DATA, this.state.url, (e: any) => this.setState({ url: e.target.value }))}
        {this.renderInputRow(TEMPLATE_DATA, this.state.template, (e: any) => this.setState({ template: e.target.value }))}
        {this.renderInputRow(SERVER_DATA, this.state.page, (e: any) => this.setState({ page: e.target.value }))}
        <h2>Your link is</h2>
        <a target="_blank" rel="noopener noreferrer" href={link}>{link}</a>
      </div>
    );
  }

  onDestinationChange(event: any) {

    this.setState({ url: event.target.value });
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

  uriSafeEncode(data: string): string {
    const base64 = btoa(data);
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
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

function checkUrlForErrors(value: string): string {
  if (!value.match(/^https?:\/\/.*/)) {
    return "The URL has to start with 'http://' or 'https://' (without the quotes)"
  }
  if (value.match(/[ "<>{}^|]/g)) {
    return "The URL contains some illegal characters that have not been properly escaped";
  }
  try {
    let url = new URL(value);
    return "";
  } catch (e) {
    return "Not a valid URL";
  }
}

const TARGET_DATA: InputRowData = {
  label: "Destination URL",
  description: "The URL that you want the user to be redirected to",
  checkForErrors: checkUrlForErrors,
}

const TEMPLATE_DATA: InputRowData = {
  label: "Template",
  description: "The template can be used to mislead the person viewing the link into believing that it has a different purpose (for example to disguise it as an unsubscribe link)",
  checkForErrors: (value: string) => {
    if (value.indexOf("%s") < 0) {
      return "Template must contain a '%s' (without the quotes) to signal where to embed the encoded URL";
    }
    return "";
  },
}

const SERVER_DATA: InputRowData = {
  label: "Redirect page URL",
  description: "The URL where your server hosts your redirect page",
  checkForErrors: checkUrlForErrors,
}

export default App;
