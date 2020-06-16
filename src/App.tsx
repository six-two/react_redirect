import React from 'react';
import './App.scss';

// TODOs
// Add a tutorial / instructions
// Make it look nice
// Add input validation
// Allow signing links?
// Add debugging features
// Add (more) templates
// Add this to my projects page. Write about stateless web apps on my projects page

const TEMPLATES = [
  "#type=email&action=unsubscribe&userId=%s&campaign=Summer2020",
  "#target=www.youtube.com&video=%s",
  "#shop=www.amazon.com&productId=B00V155S46&couponCode=%s",
]

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
        {this.renderInputRow("Destination URL", "The URL that you want the user to be redirected to", this.state.url, (e: any) => this.setState({ url: e.target.value }))}
        {this.renderInputRow("Template", "The template can be used to mislead the person viewing the link into believing that it has a different purpose (for example to disguise it as an unsubscribe link)", this.state.template, (e: any) => this.setState({ template: e.target.value }))}
        {this.renderInputRow("Redirect page URL", "The URL where your server hosts your redirect page", this.state.page, (e: any) => this.setState({ page: e.target.value }))}
        <h2>Your link is</h2>
        <a target="_blank" rel="noopener noreferrer" href={link}>{link}</a>
      </div>
    );
  }

  renderInputRow(label: string, title: string, value: string, onValueChange: (e: any) => void) {
    return <div className="input-row">
      <div className="label">{label}</div>
      <div className="input">
        <input title={title} type="text" onChange={onValueChange} value={value} />
      </div>
    </div>
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

export default App;
