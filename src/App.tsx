import React from 'react';
import './App.scss';
import * as API from './encode';
import * as Decode from './decode';
import CreateLinkView, { TextFieldValues } from './CreateLinkView';

// TODOs
// Add a tutorial / instructions [partial]
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

const EXAMPLE_STATE: TextFieldValues = {
  url: "https://example.com",
  template: randomChoice(TEMPLATES),
  page: "https://projects.six-two.dev/react_redirect/follow.html",
}

function randomChoice<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export default class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="App">
      <h1>Create a (deceptive) redirect link</h1>
      {this.renderEditView()}
    </div>
  }

  renderEditView() {
    if (this.state.data) {
      return <CreateLinkView data={this.state.data} setData={this.setData} />
    } else {
      return <div className="initial-buttons">
        <button onClick={this.loadDefaults}>
          Create new link
        </button>
        <button onClick={this.showImportDialog}>
          Import from URL
        </button>
      </div>
    }
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
        let data: TextFieldValues = { page: page, template: params, url: redirectUrl };
        this.setData(data);
      } catch (e) {
        console.error("Error importing URL:", url, "\n", e);
        alert("An error occured while importing the URL. Are you sure it is valid?");
      }
    }
  }

  setData = (newData: TextFieldValues) => {
    this.setState({
      data: newData,
    });
  }

  loadDefaults = () => {
    this.setData(EXAMPLE_STATE);
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

interface State {
  data?: TextFieldValues,
}
