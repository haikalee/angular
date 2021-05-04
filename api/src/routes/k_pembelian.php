<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
  $validasi = array(
    'id_supplier' => 'required',
    'alamat' => 'required',
    'tanggal' => 'required',
  );

  return validate($data, $validasi, $custom);
}

$app->get('/k_pembelian/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('k_pembelian.*, m_supplier.nama as supplier')
    ->from('k_pembelian')
    ->leftJoin('m_supplier', 'k_pembelian.id_supplier = m_supplier.id')
    ->where('k_pembelian.is_deleted', '=', 0)
    ->orderBy('k_pembelian.id DESC');

  // if (isset($params['filter'])) {
  //   $filter = (array) json_decode($params['filter']);
  //   foreach ($filter as $key => $value) {
  //     if ($key == 'id_supplier') {
  //       $data->where('k_pembelian.id_supplier', 'LIKE', $value);
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

$app->post('/k_pembelian/save', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $landa = new Landa();
  $validasi = Validasi($params['model']);
  // ej($params['pembelian']);
  if ($validasi === true) {
    if (isset($params['model']['tanggal'])) {
      $params['model']['tanggal'] = $landa->arrayToDate($params['model']['tanggal']);
    }

    try {
      if ($params['model']) {
        $model = $db->insert('k_pembelian', $params['model']);
      }

      foreach ($params['pembelian'] as $p) {
        if (isset($p['id'])) {
          // var_dump($p['id']);
          $p['id_k_pembelian'] = $model->id;
          // $p['id_supplier'] = $model->id_supplier;
          $stokBarang = (array) $db->select('*')
            ->from('k_barang')
            ->where('k_barang.id', '=', $p['id'])
            ->find();

          $p['id_barang'] = $p['id'];
          $stokBarang['stok'] += $p['stok'];
          if ($p['stok'] != 0) {
            $p['total'] = $p['stok'] * $p['harga_beli'];
          }
          $db->update('k_barang', $stokBarang, ['id' => $stokBarang['id']]);
          $p['id'] = '';
          $pembelian = $db->insert('k_pembelian_det', $p);
        } else {
          $p['id_k_pembelian'] = $model->id;
          $p['id_supplier'] = $model->id_supplier;
          $barang = $db->insert('k_barang', $p);
          $p['id_barang'] = $barang->id;
          $pembelian = $db->insert('k_pembelian_det', $p);
        }
      }
      return successResponse($response, $pembelian);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi masalah pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/k_pembelian/delete', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $model = $db->update('k_pembelian', ['is_deleted' => 1], ['id' => $params['id']]);
  $data = $db->select('k_pembelian.*, k_pembelian_det.*')
    ->from('k_pembelian')
    ->leftJoin('k_pembelian_det', 'k_pembelian_det.id_k_pembelian = k_pembelian.id')
    ->where('k_pembelian.id', '=', $params['id'])
    ->findAll();
  foreach ($data as $d) {
    $db->update('k_pembelian_det', ['is_deleted' => 1], ['id_k_pembelian' => $params['id']]);
    $stokBarang = (array) $db->select("*")
      ->from('k_barang')
      ->where('k_barang.id', '=', $d->id_barang)
      ->find();
    $stokBarang['stok'] -= $d->stok;
    $stokBarang['total'] = $d->harga_beli * $stokBarang['stok'];
    if ($stokBarang['stok'] == 0) {
      $stokBarang['is_deleted'] = 1;
      $db->update('k_barang', $stokBarang, ['id' => $stokBarang['id']]);
    } else {
      $db->update('k_barang', $stokBarang, ['id' => $stokBarang['id']]);
    }
  }
  if ($model) {
    return successResponse($response, [$model]);
  }
  return unprocessResponse($response, ['terjadi masalah pada server']);
});

$app->get('/k_pembelian/detail', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  // ej($params);
  $data = $db->select('k_pembelian_det.*, k_barang.*')
    ->from('k_pembelian_det')
    ->leftJoin('k_barang', 'k_pembelian_det.id_barang = k_barang.id')
    ->where('k_pembelian_det.id_k_pembelian', '=', $params['id'])
    ->findAll();

  return successResponse($response, $data);
});

$app->get('/k_pembelian/detail_sup', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db->select('k_pembelian.*, k_barang.*, k_pembelian_det.*')
    ->from('k_pembelian')
    ->leftJoin('k_pembelian_det', 'k_pembelian_det.id_k_pembelian = k_pembelian.id')
    ->leftJoin('k_barang', 'k_pembelian_det.id_barang = k_barang.id')
    ->where('k_pembelian.id_supplier', '=', $params['id'])
    ->where('k_pembelian.is_deleted', '=', 0)
    ->findAll();

  return successResponse($response, $data);
});

$app->get('/k_pembelian/list', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db->select('m_supplier_det.*, m_supplier.nama as supplier')
    ->from('m_supplier_det')
    ->leftJoin('m_supplier', 'm_supplier_det.id_supplier = m_supplier.id')
    ->findAll();
  return successResponse($response, $data);
});
