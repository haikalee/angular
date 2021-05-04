<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
  $validasi = array(
    'alamat' => 'required',
    'tanggal' => 'required',
  );
  // 'type' => 'required',

  return validate($data, $validasi, $custom);
}

$app->get('/k_penjualan/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('k_penjualan.*, k_customer.nama as nama_customer')
    ->from('k_penjualan')
    ->leftJoin('k_customer', 'k_penjualan.id_customer = k_customer.id')
    ->where('k_penjualan.is_deleted', '=', 0)
    ->orderBy('k_penjualan.id DESC');

  // if (isset($params['filter'])) {
  //   $filter = (array) json_decode($params['filter']);
  //   foreach ($filter as $key => $value) {
  //     if ($key == 'customer') {
  //       $data->where('k_penjualan.customer', 'LIKE', $value);
  //     } else if ($key == 'id_customer') {
  //       $data->where('k_penjualan.id_customer', 'LIKE', $value);
  //     }
  //   }
  // }

  if (isset($params['limit']) && !empty($params['llimit'])) {
    $data->limit($params['limit']);
  }
  if (isset($params['offset']) && !empty($params['offset'])) {
    $data->offset($params['offset']);
  }

  $models = $data->findAll();
  $totalItems = $data->count();

  return successResponse($response, [
    'list' => $models,
    'totalItems' => $totalItems
  ]);
});

$app->post('/k_penjualan/save', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $landa = new Landa();
  $validasi = Validasi($params['model']);
  // ej($validasi);
  if ($validasi === true) {
    if (isset($params['model']['tanggal'])) {
      $params['model']['tanggal'] = $landa->arrayToDate($params['model']['tanggal']);
    }

    try {
      if (isset($params['model']['id'])) {
        if ($params['isMember']) {
          $model = $db->update('k_penjualan', $params['model'], ['id' => $params['id']]);
        } else {
          $model = $db->update('k_penjualan', $params['model'], ['id' => $params['id']]);
        }
      } else {
        if ($params['isMember']) {
          $model = $db->insert('k_penjualan', $params['model']);
        } else {
          $model = $db->insert('k_penjualan', $params['model']);
        }
      }


      foreach ($params['penjualan'] as $p) {
        if (isset($p['id'])) {
          $p['id_k_penjualan'] = $model->id;
          $penjualan = $db->update('k_penjualan_det', $p, ['id' => $p['id']]);
          $stokBarang = (array) $db->select('*')
            ->from('k_barang')
            ->where('k_barang.id', '=', $penjualan->id_barang)
            ->find();
          $stokBarang['stok'] = $stokBarang['stok'] - $p['jumlah'];
          if ($stokBarang['stok'] == 0) {
            $stokBarang['is_deleted'] = 1;
          }
          $barang = $db->update('k_barang', $stokBarang, ['id' => $penjualan->id_barang]);
        } else {
          $p['id_k_penjualan'] = $model->id;
          $penjualan = $db->insert('k_penjualan_det', $p);
          $stokBarang = (array) $db->select('*')
            ->from('k_barang')
            ->where('k_barang.id', '=', $penjualan->id_barang)
            ->find();
          $stokBarang['stok'] = $stokBarang['stok'] - $p['jumlah'];
          if ($stokBarang['stok'] == 0) {
            $stokBarang['is_deleted'] = 1;
          }
          $barang = $db->update('k_barang', $stokBarang, ['id' => $penjualan->id_barang]);
        }
      }

      return successResponse($response, $penjualan);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi masalah pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/k_penjualan/delete', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $model = $db->update('k_penjualan', ['is_deleted' => 1], ['id' => $params['id']]);
  $data = $db->select('k_penjualan.*, k_penjualan_det.*')
    ->from('k_penjualan')
    ->leftJoin('k_penjualan_det', 'k_penjualan_det.id_k_penjualan = k_penjualan.id')
    ->where('k_penjualan.id', '=', $params['id'])
    ->findAll();


  foreach ($data as $d) {
    if ($d->id_barang) {
      $stokBarang = (array) $db->select("*")
        ->from('k_barang')
        ->where('k_barang.id', '=', $d->id_barang)
        ->find();

      $stokBarang['stok'] += $d->jumlah;
      $stokBarang['total'] = $d->harga_beli * $stokBarang['stok'];

      if ($stokBarang['stok'] != 0) {
        $stokBarang['is_deleted'] = 0;
      }
      $db->update('k_barang', $stokBarang, ['id' => $stokBarang['id']]);
    }
  }
  if (isset($model)) {
    return successResponse($response, [$model]);
  }
  return unprocessResponse($response, ['terjadi masalah pada server']);
});

$app->get('/k_penjualan/detail', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db->select('*')
    ->from('k_penjualan_det')
    ->where('k_penjualan_det.id_k_penjualan', '=', $params['id'])
    ->findAll();

  return successResponse($response,  $data);
});

$app->get('/k_penjualan/customer', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $data = $db->select('*')
    ->from('k_penjualan')
    ->where('k_penjualan.id_customer', '=', $params['id'])
    ->andWhere('k_penjualan.is_deleted', '=', 0)
    ->findAll();

  return successResponse($response, count($data));
});

$app->get('/k_penjualan/print', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db->select('k_penjualan.*, k_customer.nama as nama')
    ->from('k_penjualan')
    ->leftJoin('k_customer', 'k_customer.id = k_penjualan.id_customer')
    ->where('k_penjualan.id', '=', $params['id'])
    ->find();
  $listBarang = $db->select('k_penjualan_det.*, k_barang.nama_barang as barang')
    ->from('k_penjualan_det')
    ->leftJoin('k_barang', 'k_penjualan_det.id_barang = k_barang.id')
    ->where('k_penjualan_det.id_k_penjualan', '=', $params['id'])
    ->findAll();

  if (isset($data)) {
    $view = twigView();
    $content = $view->fetch('laporan/transaksi.html', [
      'dataAtas' => $data,
      'dataBawah' => $listBarang
    ]);

    echo $content;

    echo "
    <script type='text/javascript'>
      window.print();
      setTimeout(function() {
        window.close();
      }, 500);
    </script>";
  }
});
