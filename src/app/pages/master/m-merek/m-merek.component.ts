import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: "app-m-merek",
  templateUrl: "./m-merek.component.html",
  styleUrls: ["./m-merek.component.scss"],
})
export class MMerekComponent implements OnInit {
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
  };
  merek: {
    nama;
  };
  showForm: boolean;
  model: any = {};
  listData: any;
  constructor(
    private landaService: LandaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.pageTitle = "Merek";
    this.breadCrumbItem = [
      {
        label: "Master",
      },
      {
        label: "Merek",
        active: true,
      },
    ];

    this.modelParam = {
      nama: "",
    };
    this.merek = {
      nama: "",
    };
    this.getData();
    this.empty();
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
          .DataGet("/m_merek/index", params)
          .subscribe((res: any) => {
            this.listData = res.data.list;
            console.log(res.data);
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
    };
    this.getData();
  }

  create() {
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Data";
    this.empty();
    this.isView = false;
  }

  view(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Merek ${val.nama}`;
    this.isView = true;
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Data";
    this.getData();
  }

  simpan() {
    this.landaService
      .DataPost("/m_merek/save", this.merek)
      .subscribe((res: any) => {
        if (res.status_code === 200) {
          this.landaService.alertSuccess("Berhasil", "Data telah dimasukkan");
          this.modalService.dismissAll();
        } else {
          this.landaService.alertError("Mohon maaf", res.errors);
        }
      });
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService.DataPost("/m_merek/save", final).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.landaService.alertSuccess("Berhasil", "Data telah dimasukkan");
        this.index();
      } else {
        this.landaService.alertError("Mohon maaf", res.errors);
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
          .DataPost("/m_merek/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess(
                "Berhasil",
                "Data Baru telah disimpan !"
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon maaf", res.errors);
            }
          });
      }
    });
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Merek: ${val.nama}`;
    this.isView = false;
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  modaltambahkelompok(modal) {
    this.modalService.open(modal, { size: "lg", backdrop: "static" });
  }
}
