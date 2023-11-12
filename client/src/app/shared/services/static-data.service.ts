import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StaticData } from '../models/static-data';
import { fetchResult } from '../utils/fetch.helper';

const STATIC_DATA_BASE_URL = `${environment.authServiceURL}/static-data`;

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor() { }

  async getCities() : Promise<StaticData[] | null>
  {
    try {
      let response = await fetchResult(`${STATIC_DATA_BASE_URL}/cities`, {
        method: "GET"
      });

      return response.data;
    } catch (error) {
      return null;
    }
  }

  async getEventCategories() : Promise<StaticData[] | null>
  {
    try {
      let response = await fetchResult(`${STATIC_DATA_BASE_URL}/event-categories`, {
        method: "GET"
      });

      return response.data;
    } catch (error) {
      return null;
    }
  }
}
