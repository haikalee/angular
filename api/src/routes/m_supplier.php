<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
  $validasi = array(
    'nama' => 'required',
    'alamat' => 'required',
    'no_hp' => 'required',
    'email' => 'required',
  );

  $cek = validate($data, $validasi, $custom);
  return $cek;
}

$app->get('/m_supplier/index', function ($request, $response) {
  $params = $request->getParams();
  $db = DB::db();

  $data = $db->select('*')
    ->from('m_supplier')
    ->where('m_supplier.is_deleted', '=', 0)
    ->orderBy('m_supplier.id DESC');

  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach ($filter as $key => $value) {
      if ($key == 'nama') {
        $data->where('m_supplier.nama', 'LIKE', $value);
      }
    }
  }

  if (isset($params['limit']) && !empty($params['limit'])) {
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

$app->post('/m_supplier/save', function ($request, $response) {
  $data = $request->getParams();
  $db = Db::db();
  $landa = new Landa();
  $validasi = Validasi($data);
  if ($validasi === true) {
    if (isset($data['tanggal'])) {
      $data['tanggal'] = $landa->arrayToDate($data['tanggal']);
    }

    if (isset($data['foto']['base64']) && !empty($data['foto']['base64'])) {
      $path = 'assets/img/supplier/';
      $uploadFile = $landa->base64ToImage($path,  $data['foto']['base64']);

      if ($uploadFile) {
        $data['foto'] = $uploadFile['data'];
      } else {
        return unprocessResponse($response, [$uploadFile['error']]);
      }
    }

    try {
      if (isset($data['id'])) {
        $model = $db->update('m_supplier', $data, ['id' => $data['id']]);
      } else {
        $model = $db->insert('m_supplier', $data);
      }

      return successResponse($response, $model);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi masalah pada server']);
    }
    return unprocessResponse($response, $validasi);
  }
});

$app->post('/m_supplier/delete', function ($request, $response) {
  $data = $request->getparams();
  $db = Db::db();
  $model = $db->update('m_supplier', ['is_deleted' => 1], ['id' => $data['id']]);

  if (isset($model)) {
    return successResponse($response, [$model]);
  }
  return unprocessResponse($response, ['Terjadi masalah pada server']);
});

// $app->get('/m_supplier/detail', function ($request, $response) {
//   $params = $request->getparams();
//   $db = Db::db();

//   $data = $db->select('m_supplier_det.*')
//     ->from('m_supplier_det')
//     ->where('m_supplier_det.id_supplier', '=', $params['id'])
//     ->findAll();
//   return successResponse($response, $data);
// });

// $app->get('/m_supplier/barang', function ($request, $response) {
//   $params = $request->getparams();
//   $db = Db::db();

//   $data = $db->select('m_supplier_det.*')
//     ->from('m_supplier_det')
//     ->where('m_supplier_det.id_supplier', '=', $params['id'])
//     ->findAll();
//   return successResponse($response, $data);
// });
