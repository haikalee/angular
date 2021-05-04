<?php

use Service\Db;
use Service\Landa;

function toList($data)
{
  $db = Db::db();

  $tanggalInduk = '';
  $totalInduk = 0;

  // Mencari Induk Tanggal
  if (count($data) > 1) {
    for ($i = 0; $i < count($data); $i++) {
      if (($i + 1) < count($data)) {
        if ($data[$i]->tanggal == $data[$i + 1]->tanggal) {
          $tanggalInduk = $data[$i]->tanggal;
        }
      }
    }
  } else {
    $tanggalInduk = $data[0]->tanggal;
  }

  // Mencari Details
  $details = $db->select('
  k_pembelian.*,
  k_pembelian_det.*,
  k_barang.*,
  m_supplier.*,
  k_barang.*')
    ->from('k_pembelian')
    ->leftJoin('k_pembelian_det', 'k_pembelian_det.id_k_pembelian = k_pembelian.id')
    ->leftJoin('k_barang', 'k_barang.id = k_pembelian_det.id_barang')
    ->leftJoin('m_supplier', 'm_supplier.id = k_pembelian.id_supplier')
    ->where('k_pembelian.tanggal', '=', $tanggalInduk)
    ->findAll();

  // Mencari Total
  foreach ($data as $d) {
    $totalInduk += $d->total;
  }

  return [
    'tgl' => $tanggalInduk,
    'total' => $totalInduk,
    'rows' => count($details),
    'detail' => $details,
  ];
}

$app->get('/l_pembelian/index', function ($request, $response) {
  $params = $request->getParams();
  $db = Db::db();
  $data = $db->select('
    k_pembelian.*,
    k_pembelian_det.*,
    k_barang.*,
    m_supplier.*,
    k_barang.*')
    ->from('k_pembelian')
    ->leftJoin('k_pembelian_det', 'k_pembelian_det.id_k_pembelian = k_pembelian.id')
    ->leftJoin('k_barang', 'k_barang.id = k_pembelian_det.id_barang')
    ->leftJoin('m_supplier', 'm_supplier.id = k_pembelian.id_supplier')
    ->where('k_pembelian.tanggal', '>', $params['periode_mulai'])
    ->andWhere('k_pembelian.tanggal', '<', $params['periode_selesai'])
    ->customWhere('k_pembelian.id_supplier IN (' . $params['id_supplier'] . ')', "AND")
    ->findAll();
  $supplier = '';
  foreach ($data as $d) {
    $supplier = $d->nama;
    break;
  }

  $arr = [
    'list' => [toList($data)],
    'data_atas' => [
      'periode_awal' => $params['periode_mulai'],
      'periode_akhir' => $params['periode_selesai'],
      'supplier' => $supplier,
      'total_bawah' => toList($data)['total']
    ]
  ];

  if (isset($params['is_export']) && 1 == $params['is_export']) {
    $view = twigView();
    $content = $view->fetch('laporan/pembelian.html', [
      'list' => $arr,
    ]);
    echo $content;
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
  } elseif (isset($params['is_print']) && 1 == $params['is_print']) {
    $view = twigView();
    $content = $view->fetch('laporan/pembelian.html', [
      'list' => $arr,
    ]);
    echo $content;
    echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';
  } else {
    return successResponse($response, [
      'list' => $arr,
    ]);
  }
});
