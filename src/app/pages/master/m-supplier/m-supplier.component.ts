import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-m-supplier",
  templateUrl: "./m-supplier.component.html",
  styleUrls: ["./m-supplier.component.scss"],
})
export class MSupplierComponent implements OnInit {
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
  model: any;
  listData: any;
  // listBarang: any;
  listType: any;

  myForm = new FormGroup({
    fileUpload: new FormControl("", [Validators.required]),
  });

  constructor(private landaService: LandaService) {}

  ngOnInit(): void {
    this.pageTitle = "Supplier";
    this.breadCrumbItem = [
      {
        label: "Master",
      },
      {
        label: "Supplier",
        active: true,
      },
    ];

    this.modelParam = {
      nama: "",
      alamat: "",
      no_hp: "",
      email: "",
    };
    this.listType = [
      {
        id: 1,
        nama: "kg",
      },
      {
        id: 2,
        nama: "liter",
      },
      {
        id: 3,
        nama: "bungkus",
      },
    ];
    this.model = {};
    this.getData();
    this.empty();
  }

  reloadDataTable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  index() {
    this.getData();
    this.showForm = !this.showForm;
    this.pageTitle = "Supplier";
    this.empty();
    this.isView = false;
  }

  view(val) {
    // this.getDetail(val.id);
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Suplier : ${val.nama}`;
    this.isView = true;
    this.model.foto = this.landaService.getImage("supplier", val.foto);
  }

  edit(val) {
    // this.getDetail(val.id);
    this.showForm = !this.showForm;
    this.model = val;
    this.pageTitle = `Suplier : ${val.nama}`;
    this.isView = false;
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
          .DataPost("/m_supplier/delete", data)
          .subscribe((res: any) => {
            if (res.status_code === 200) {
              this.landaService.alertSuccess("berhasil", "Data telah dihapus");
              this.reloadDataTable();
            } else {
              this.landaService.alertError("Mohon Maaf", res.errors);
            }
          });
      }
    });
  }

  create() {
    this.showForm = !this.showForm;
    this.pageTitle = "Tambah data";
    this.empty();
    this.isView = false;
    this.model.foto = this.landaService.getImage("supplier", "default.png");
  }

  save() {
    const final = Object.assign(this.model);
    this.landaService
      .DataPost("/m_supplier/save", final)
      .subscribe((res: any) => {
        if (res.status_code == 200) {
          this.landaService.alertSuccess("Berhasil", "Data telah disimpan");
          this.index();
        } else {
          this.landaService.alertError("Mohon Maaf", res.errors);
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
          .DataGet("/m_supplier/index", params)
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
    this.model = {};
    this.getData();
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.model.foto = {
          base64: reader.result as string,
        };
        this.myForm.patchValue({
          fileUpload: reader.result,
        });
      };
    }
  }
}
