import React from 'react';
import './App.css';

// TODOs
// Add a tutorial / instructions
// Make it look nice
// Add debugging features
// Add (more) templates
// Add this to my projects page. Write about stateless web apps on my projects page

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      url: "https://example.com",
      template: "#type=email&action=unsubscribe&userId=%s&campaign=Summer2020",
    }
  }

  render() {
    let encoded = "LNK" + this.uriSafeEncode(this.state.url);
    let link = "follow.html"
    // let link = "file:///home/user/c/react_redirect/public/follow.html"
    link += this.state.template.replace("%s", encoded);

    return (
      <div className="App">
      <h1>Create a (deceptive) redirect link</h1>
      URL:<input type="text" onChange={this.onUrlChange} value={this.state.url} />
      <hr />
      Template:<input type="text" onChange={this.onTemplateChange} value={this.state.template} />
      <hr />
      Created link: <a target="_blank" rel="noopener noreferrer" href={link}>{link}</a>
      </div>
    );
  }

  onUrlChange = (e: any) => {
    this.setState({url: e.target.value});
  }

  onTemplateChange = (e: any) => {
    this.setState({template: e.target.value});
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
}

export default App;
