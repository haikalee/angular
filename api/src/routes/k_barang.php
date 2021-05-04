<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
  $validasi = array(
    'nama_barang' => 'required',
    'tipe_unit' => 'required',
    'stok' => 'required',
    'harga_jual' => 'required',
    'diskon_barang' => 'required',
    'harga_beli' => 'required',
    'id_supplier' => 'required',
  );

  return validate($data, $validasi, $custom);
}

$app->get('/k_barang/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('k_barang.*, m_supplier.nama as supplier')
    ->from('k_barang')
    ->leftJoin('m_supplier', 'k_barang.id_supplier = m_supplier.id')
    ->where('k_barang.is_deleted', '=', 0)
    ->orderBy('k_barang.id DESC');

  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach ($filter as $key => $value) {
      if ($key == 'nama') {
        $data->where('k_barang.nama_barang', 'LIKE', $value);
      }
    }
  }

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

$app->post('/k_barang/save', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $landa = new Landa();
  $validasi = Validasi($params);
  if ($validasi === true) {
    if (isset($params['id_supplier']['id'])) {
      $params['id_supplier'] = $params['id_supplier']['id'];
    }

    if (isset($params['supplier_id'])) {
      $params['id_supplier'] = $params['supplier_id'];
    }

    if (isset($params['tipe_unit']['nama'])) {
      $params['tipe_unit'] = $params['tipe_unit']['nama'];
    }

    if (isset($params['tanggal'])) {
      $params['tanggal'] = $landa->arrayToDate($params['tanggal']);
    }

    try {
      if (isset($params['id'])) {
        $model = $db->update('k_barang', $params, ['id' => $params['id']]);
      } else {
        $model = $db->insert('k_barang', $params);
      }
      return successResponse($response, $model);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi kesalahan pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/k_barang/delete', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $model = $db->update('k_barang', ['is_deleted' => 1], ['id' => $params['id']]);

  if (isset($model)) {
    return successResponse($response, [$model]);
  }

  return unprocessResponse($response, ['terjadi masalah pada server']);
});

$app->get('/k_barang/id_barang', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('*')
    ->from('k_barang')
    ->where('k_barang.id', '=', $params['id'])
    ->find();

  // ej($data);
  return successResponse($response, $data);
  // return unprocessResponse($response, ['terjadi masalah pada server']);
});
