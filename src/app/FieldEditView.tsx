import React from 'react';
import { TextFieldValues } from './CreateLinkView';


export default class FieldEditView extends React.Component<Props> {
  render() {
    let rowData = this.props.row;
    let value = this.props.data[rowData.fieldName];
    let error = rowData.checkForErrors(value);
    let inputClass = error ? "error" : undefined;

    return <div>
      <div className="input-row">
        <div className="label">
          {rowData.label}
        </div>
        <div className="input">
          <input className={inputClass}
            type="text"
            title={rowData.description}
            value={value}
            onChange={this.onValueChange}
          />
        </div>
      </div>
      {error ? <div className="err-msg">{error}</div> : null}
    </div>;
  }

  onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let copy: TextFieldValues = { ...this.props.data };
    copy[this.props.row.fieldName] = e.target.value;
    this.props.setData(copy);
  }
}

export interface RowDescription {
  label: string,
  description: string,
  checkForErrors: (value: string) => string,
  fieldName: string,
}

interface Props {
  row: RowDescription,
  data: TextFieldValues,
  setData: (newData: TextFieldValues) => void,
}
