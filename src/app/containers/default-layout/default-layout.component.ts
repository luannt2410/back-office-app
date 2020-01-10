import { Component, OnInit, ViewChild } from '@angular/core';
import { navItems } from '../../_nav';
import { TestService } from '../test.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { query } from '@angular/animations';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  gridOptions: Partial<GridOptions>;
  gridApi;
  gridColumnApi;
  userSubcriber: Subscription;
  rowData = [];
  columnDefs = [
    { headerName: 'Data ID', field: 'DATA_ID', sortable: true },
    { headerName: 'Data Name', field: 'DATA_NM', sortable: true },
    { headerName: 'Data Amount', field: 'DATA_AMOUT', sortable: true },
    { headerName: 'Data From', field: 'DATA_FROM', sortable: true },
    { headerName: 'Data To', field: 'DATA_TO', sortable: true },
    { headerName: 'Data Details', field: 'DATA_DETAIL' }
  ];
  onShowGrid: boolean;
  limit = 5;
  currentTotal = 0;
  cacheOverflowSize: number;
  maxConcurrentDatasourceRequest: number;
  infiniteInitialRowCount: number;
  constructor(
    private testService: TestService
  ) {
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequest = 2;
    this.infiniteInitialRowCount = 2;

    this.gridOptions = {
      headerHeight: 45,
      rowHeight: 30,
      cacheBlockSize: 90,
      paginationPageSize: 5,
      rowModelType: 'infinite'
    };
  }

  onGridReady(params) {
    console.log('On Grid Ready');
    this.gridApi = params.api;
    this.gridColumnApi = params.gridColumnApi;
    const datasource = {
      getRows: (params: IGetRowsParams) => {
        this.getData(params);
      }
    };
    console.log(datasource);
    this.gridApi.setDatasource(datasource);
  }

  ngOnInit() {
  }

  logout() {
    console.log('in logout');
    console.log(localStorage.getItem('currentUser'));
    localStorage.clear();
    console.log(localStorage.getItem('currentUser'));
  }

  getData(params) {
    this.testService.GetData(params).subscribe((res) => {
      for (let index = 0; index < Object.keys(res).length; index++) {
        this.rowData.push(res[index]);
      }
      console.log(this.rowData);
      const data = { users: this.rowData, totalRecords: Object.keys(this.rowData).length };
      params.successCallback(data['users'], data['totalRecords']);
    }, (e) => {
      console.log('Not send');
      console.log(e);
    });
  }

  previous() {
    // if (this.currentTotal === this.limit) {
    //   return;
    // } else {
    //   this.currentTotal = this.currentTotal - this.limit;
    // }
  }

  onCellClicked(event) {
    console.log(event);
    console.log(111111);
  }

  onCellDoubleClicked(event) {
    console.log(event);
    console.log(2222);
  }

  onPaginationChanged(event) {
    console.log(event);
  }

}
