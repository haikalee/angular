import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-k-customer",
  templateUrl: "./k-customer.component.html",
  styleUrls: ["./k-customer.component.scss"],
})
export class KCustomerComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  showForm: boolean;
  isView: boolean;
  isEdit: boolean;
  listData: any;
  model: any = {};
  modelParam: { nama };

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Customer";
    this.breadCrumbItems = [
      {
        label: "Kasir",
      },
      {
        label: "Customer",
        active: true,
      },
    ];
    this.modelParam = {
      nama: "",
    };
    this.empty();
    this.getData();
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  empty() {
    this.model = {};
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Customer";
    this.getData();
    this.empty();
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Customer";
    this.isView = false;
    this.isEdit = false;
  }

  view(val) {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = `Customer ${val.nama}`;
    this.model = val;
    this.isView = true;
    this.isEdit = false;
  }

  edit(val) {
    this.empty();
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Customer: ${val.nama}`;
    this.isView = false;
    this.isEdit = true;
  }

  delete(val) {
    const data = {
      id: val.id ? val.id : null,
      is_deleted: 1,
    };

    Swal.fire({
      title: "Apakah anda yakin ?",
      text: "Menghapus data Hp akan berpengaruh terhadap data lainnya",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Ya, Hapus data ini !",
    }).then((result) => {
      if (result.value) {
        this.landaService
          .DataPost("/k_customer/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess(
                "berhasil",
                "data berhasi dihapus"
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon Maaf", res.errors);
            }
          });
      }
    });
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService
      .DataPost("/k_customer/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("berhasil", "data berhasi dimasukkan");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
          this.index();
        }
      });
  }

  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: "full_numbers",
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };

        this.landaService
          .DataGet("/k_customer/index", params)
          .subscribe((res: any) => {
            this.listData = res.data.list;
            callback({
              recordsTotal: res.data.totalItems,
              recordsFiltered: res.data.totalItems,
              data: [],
            });
          });
      },
    };
  }
}
