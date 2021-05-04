import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-m-hp",
  templateUrl: "./m-hp.component.html",
  styleUrls: ["./m-hp.component.scss"],
})
export class MHpComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  breadCrumbItems: Array<{}>;
  pageTitle: string;
  isView: boolean;
  isEdit: boolean;
  modelParam: {
    nama;
    stok;
    hargaBeli;
    hargaJual;
    dayaBaterai;
    rom;
    ram;
    merek;
    prosessor;
  };
  showForm: boolean;
  model: any = {};
  listData: any;
  listSupplier: any;
  listMerek: any;

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "HP";
    this.breadCrumbItems = [
      {
        label: "Master",
      },
      {
        label: "HP",
        active: true,
      },
    ];
    this.modelParam = {
      nama: "",
      stok: "",
      prosessor: "",
      hargaBeli: "",
      hargaJual: "",
      dayaBaterai: "",
      rom: "",
      ram: "",
      merek: "",
    };
    this.getData();
    this.empty();
    this.getMerekSupplier();
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
          .DataGet("/m_hp/index", params)
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
      stok: "",
      prosessor: "",
      hargaBeli: "",
      hargaJual: "",
      dayaBaterai: "",
      rom: "",
      ram: "",
    };
    this.getData();
  }

  index() {
    this.showForm = !this.showForm;
    this.pageTitle = "Data Hp";
    this.getData();
    this.empty();
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah Data Hp";
    this.isView = false;
    this.getMerekSupplier();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.model = val;
    this.model.id_merek = val.merek;
    this.model.id_supplier = val.supplier;
    this.pageTitle = "Hp : " + val.nama;
    this.getData();
    this.isView = false;
    this.isEdit = true;

    this.getMerekSupplier();
  }

  view(val) {
    this.model = val;
    this.model.id_merek = val.merek;
    this.model.id_supplier = val.supplier;
    this.showForm = !this.showForm;
    this.pageTitle = "Hp : " + val.nama;
    this.getData();
    this.isView = true;
    this.getMerekSupplier();
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService.DataPost("/m_hp/save", final).subscribe((res: any) => {
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
          .DataPost("/m_hp/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess(
                "Berhasil",
                "Data Hp telah dihapus !"
              );
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon Maaf", res.errors);
            }
          });
      }
    });
  }

  getMerekSupplier() {
    this.landaService.DataGet("/m_hp/merek", {}).subscribe((res: any) => {
      this.listMerek = res.data.list;
    });
    this.landaService.DataGet("/m_supplier/index", {}).subscribe((res: any) => {
      this.listSupplier = res.data.list;
    });
  }
}
