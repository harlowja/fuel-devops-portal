import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import cx from 'classnames';

import {PERIODS} from '../consts';

@observer(['uiState'])
export default class StatusDataPeriodPicker extends Component {
  @observable actionInProgress = false

  async changeDataPeriod(dataPeriod) {
    if (this.props.onDataPeriodChange) {
      this.actionInProgress = true;
      try {
        await this.props.onDataPeriodChange(dataPeriod);
      } finally {
        this.actionInProgress = false;
      }
    } else {
      this.props.uiState.activeStatusDataPeriod = dataPeriod;
    }
  }

  render() {
    const {activeStatusDataPeriod} = this.props.uiState;
    return (
      <div className={cx('btn-group', this.props.className)}>
        {PERIODS.map((period) => {
          return (
            <button
              key={period}
              disabled={this.actionInProgress}
              className={cx('btn btn-default', {active: period === activeStatusDataPeriod})}
              onClick={() => this.changeDataPeriod(period)}
            >
              {period}
            </button>
          );
        })}
      </div>
    );
  }
}
