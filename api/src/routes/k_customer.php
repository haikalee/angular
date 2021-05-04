<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array())
{
  $validasi = array(
    'nama' => 'required',
    'alamat' => 'required',
  );

  return validate($data, $validasi, $custom);
}

$app->get('/k_customer/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('*')
    ->from('k_customer')
    ->where('k_customer.is_deleted', '=', 0)
    ->orderBy('k_customer.id DESC');

  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach ($filter as $key => $value) {
      if ($key == 'customer') {
        $data->where('k_customer.name', 'LIKE', $value);
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

$app->post('/k_customer/save', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $landa = new Landa();
  $validasi = Validasi($params);

  if ($validasi === true) {
    if (isset($params['tanggal'])) {
      $params['tanggal'] = $landa->arrayToDate($params['tanggal']);
    }

    try {
      if (isset($params['id'])) {
        $model = $db->update('k_customer', $params, ['id' => $params['id']]);
      } else {
        $model = $db->insert('k_customer', $params);
      }
      return successResponse($response, $model);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi kesalahan pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/k_customer/delete', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $model = $db->update('k_customer', ['is_deleted' => 1], ['id' => $params['id']]);

  if (isset($model)) {
    return successResponse($response, [$model]);
  }

  return unprocessResponse($response, ['terjadi masalah pada server']);
});

$app->get('/k_customer/id', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data =  $db->select('*')
    ->from('k_customer')
    ->where('k_customer.id', '=', $params['id'])
    ->find();

  // ej($data);
  return successResponse($response, $data);
  // return unprocessResponse($response, ['terjadi masalah pada server']);
});
