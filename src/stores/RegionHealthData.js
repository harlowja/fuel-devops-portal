import {observable, asMap, action} from 'mobx';
import {without} from 'lodash';

export default class RegionHealthData {
  @observable dataByRegion = asMap({})

  @action
  initializeRegionData(regionName, period, serviceName = 'aggregated') {
    if (!this.dataByRegion.get(regionName)) {
      this.dataByRegion.set(regionName, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period)) {
      this.dataByRegion.get(regionName).set(period, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period).get(serviceName)) {
      this.dataByRegion.get(regionName).get(period).set(serviceName, observable({
        fci: null,
        fciData: [],
        apiCalls: null,
        apiCallsData: [],
        responseSize: null,
        responseSizeData: [],
        responseTime: null,
        responseTimeData: [],
        lastUpdate: null
      }));
    }
    return this.dataByRegion.get(regionName).get(period).get(serviceName);
  }

  @action
  update(regionName, period, serviceName = 'aggregated', plainHealthData) {
    const {
      fci,
      fci_data: fciData,
      api_calls_count: apiCalls,
      api_calls_count_data: apiCallsData,
      response_size: responseSize,
      response_size_data: responseSizeData,
      response_time: responseTime,
      response_time_data: responseTimeData
    } = plainHealthData;
    Object.assign(this.initializeRegionData(regionName, period, serviceName), {
      fci,
      fciData,
      apiCalls,
      apiCallsData,
      responseSize,
      responseSizeData,
      responseTime,
      responseTimeData,
      lastUpdate: new Date()
    });
  }

  getRegionServices(regionName, period) {
    this.initializeRegionData(regionName, period);
    return without(this.dataByRegion.get(regionName).get(period).keys(), 'aggregated');
  }

  get(regionName, period, serviceName = 'aggregated') {
    try {
      return this.dataByRegion.get(regionName).get(period).get(serviceName);
    } catch (e) {
      return null;
    }
  }
}
