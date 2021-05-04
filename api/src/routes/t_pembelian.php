<?php

use Service\Db;
use Service\Landa;

function Validasi($data, $custom = array()) {
  $validasi = array(
    'id_supplier' => 'required',
    'tanggal' => 'required',
    'kode' => 'required',
  );

  return validate($data, $validasi, $custom);
}

$app->get('/t_pembelian/index', function ($request, $response) {
  // var_dump($request->getParams());
  $params = $request->getParams();
  $db = Db::db();

  $data = $db ->select('t_pembelian.*, m_supplier.nama as supplier')
              ->from('t_pembelian')
              ->leftJoin('m_supplier', 't_pembelian.id_supplier = m_supplier.id')
              ->where('t_pembelian.is_deleted', '=', 0)
              ->orderBy('t_pembelian.id DESC');

  if (isset($params['filter'])) {
    $filter = (array) json_decode($params['filter']);
    foreach ($filter as $key => $value) {
      if ($key == 'id_supplier') {
        $data->where('t_pembelian.id_supplier', 'LIKE', $value);
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

$app->post('/t_pembelian/save', function ($request, $response) {
  $data = $request->getParams();
  $db = Db::db();
  $landa = new Landa();

  $validasi = Validasi($data['model']);
  if ($validasi === true) {
    if (isset($data['model']['tanggal'])) {
      $data['model']['tanggal'] = $landa->arrayToDate($data['model']['tanggal']);
    }

    try {
      if (isset($data['model']['id'])) {
        $model = $db->update('t_pembelian', $data['model'], ['id' => $data['model']['id']]);
      } else {
        $model = $db->insert('t_pembelian', $data['model']);
      }
      
      foreach ($data['pembelian'] as $p) {
        // var_dump($p); die;
        if (isset($p['id'])) {
          $p['id_t_pembelian'] = $model->id;
          $pembelian = $db->update('t_pembelian_det', $p, ['id' => $p['id']]);
        } else {
          $p['id_t_pembelian'] = $model->id;
          $pembelian = $db->insert('t_pembelian_det', $p);
        }
      }

      return successResponse($response, $pembelian);
    } catch (Exception $e) {
      return unprocessResponse($response, ['terjadi masalah pada server']);
    }
  }
  return unprocessResponse($response, $validasi);
});

$app->post('/t_pembelian/delete', function ($request, $response) {
  $data = $request->getParams();
  $db = Db::db();
  $model = $db->update('t_pembelian', ['is_deleted' => 1],['id' => $data['id']]);
  
  if (isset($model)) {
    return successResponse($response, [$model]);
  }
  return unprocessResponse($response,['terjadi masalah pada server']);
});

$app->get('/t_pembelian/detailpembelian', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  
  $data = $db ->select('t_pembelian_det.*')
              ->from('t_pembelian_det')
              ->where('t_pembelian_det.id_t_pembelian', '=', $params['id'])
              ->orderBy('t_pembelian_det.id DESC');

  return successResponse($response, ['list' => $data->findAll()]);
});

$app->get('/t_pembelian/hp', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db ->select('t_pembelian_det.*, m_hp.nama as hp')
              ->from('t_pembelian_det')
              ->join('JOIN', 'm_hp', 't_pembelian_det.id_m_hp = m_hp.id')
              ->where('t_pembelian_det.id_t_pembelian', '=', $params['id'])
              ->findAll();

  return successResponse($response,  $data);
});

$app->get('/t_pembelian/id_hp', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();

  $data = $db ->select('m_hp.harga_beli')
              ->from('m_hp')
              ->where('m_hp.id', '=', $params['id'])
              ->find();

  return successResponse($response,  $data->harga_beli);
});