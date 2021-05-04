import { NgModule } from "@angular/core";
import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "../../../environments/environment";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "../../core/services/landa.service";
import { ChartDataSets, ChartOptions } from "chart.js";
import { MultiDataSet, Color, Label } from "ng2-charts";
import { ChartType } from "chart.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  apiURL = environment.apiURL;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  jumlahPetani: any = [];
  TambakMasuk: any = [];
  listJadwal: any;
  model: any = [];
  y: any = [];

  diagram: {
    jumlahPetani;
    TambakMasuk;
  };

  dgvalue: any;
  dataDiagram: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  // CHARTS 1
  barChartLabels: Label[] = [];
  ChartDataSets: any;
  chartBarOptions: any;
  chartBarLegend: any;
  barChartType: ChartType = "bar";
  barChartData: MultiDataSet[] = [];
  barChartColor: Color[] = [];
  listTahun: any[];
  luas: number;
  dataGrafik: any;
  dataTableV: any = [];

  jumlahBarang: any;
  jumlahMerek: any;
  jumlahSupplier: any;

  // dounatchart
  // CHARTS 1
  doughnutChartLabels: Label[] = ["Barang", "Konsumen", "Supplier"];
  doughnutChartType: ChartType = "doughnut";
  doughnutChartData: MultiDataSet = [
    [this.dgvalue, this.dgvalue, this.dgvalue],
  ];
  donutColors = [
    {
      backgroundColor: [
        "rgba(32, 168, 159, 1)",
        "rgba(247, 111, 111, 1)",
        "rgba(47, 222, 222, 1)",
      ],
    },
  ];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,0,0,0.3)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [];

  constructor(private landaService: LandaService) {}

  ngOnInit() {
    this.pageTitle = "Dashboard";
    this.breadCrumbItems = [
      {
        label: "Welcome To Atina",
        active: true,
      },
    ];

    this.jumlahBarang = 0;
    this.jumlahMerek = 0;
    this.jumlahSupplier = 0;
    this.getJumlah();
  }

  getJumlah() {
    this.landaService
      .DataGet("/dashboard/getdata", {})
      .subscribe((res: any) => {
        this.jumlahBarang = res.data.barang;
        this.jumlahMerek = res.data.merek;
        this.jumlahSupplier = res.data.supplier;

        this.doughnutChartData = [
          [this.jumlahBarang, this.jumlahMerek, this.jumlahSupplier],
        ];

        this.lineChartData = [
          {
            data: [this.jumlahBarang, this.jumlahMerek, this.jumlahSupplier],
            label: "Jumlah",
          },
        ];
        
        this.lineChartLabels = ["Barang", "Merek", "Supplier"];
      });
  }
}
