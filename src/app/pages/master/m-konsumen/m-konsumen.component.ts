import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-m-konsumen",
  templateUrl: "./m-konsumen.component.html",
  styleUrls: ["./m-konsumen.component.scss"],
})
export class MKonsumenComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItem: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  modelParam: {
    nama;
    alamat;
    no_hp;
    email;
  };
  showForm: boolean;
  model: any = {};
  listData: any;
  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Konsumen";
    this.breadCrumbItem = [
      {
        label: "Master",
      },
      {
        label: "Konsumen",
        active: true,
      },
    ];
    this.modelParam = {
      nama: "",
      alamat: "",
      no_hp: "",
      email: "",
    };
    this.getData();
    this.empty();
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
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
          .DataGet("/m_konsumen/index", params)
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

  empty() {
    this.model = {
      nama: "",
      alamat: "",
      no_hp: "",
      email: "",
    };
    this.getData();
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Data Konsumen";
    this.getData();
  }

  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Konsumen: ${val.nama}`;
    this.isView = true;
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Konsumen: ${val.nama}`;
    this.isView = false;
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah data konsumen";
    this.isView = false;
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService
      .DataPost("/m_konsumen/save", final)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("Berhasil", "Data Hp telah disimpan!");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
        }
      });
  }

  delete(val) {
    const data = {
      id: val != null ? val.id : null,
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
          .DataPost("/m_konsumen/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess("Berhasil", "Data Telah Dihapus");
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon Maaf", res.errors);
            }
          });
      }
    });
  }
}
