<?php 
use Service\Db;
use Service\Landa;

$app->get('/m_kategori/index', function($request, $response) {  
  $params = $request->getParams();
  $db     = Db::db();

  $data = $db->select('*')
              ->from('m_kategori')
              ->where('m_kategori.is_deleted','=',0)
              ->orderBy('m_kategori.id DESC');

              // if (isset($params['filter'])) {
              //     $filter = (array) json_decode($params['filter']);
              //     foreach ($filter as $key => $value) {
              //         if ($key == 'nama') {
              //             $data->where('m._kategori.nama','LIKE',$value);
              //         }
              //     }
              // }
              // if (isset($params['limit']) && !empty($params['llimit'])) {
              //     $data->limit($params['limit']);
              // }
              // if (isset($params['offset']) && !empty($params['offset'])) {
              //     $data->offset($params['offset']);
              // }
              $models     = $data->findAll();
              $totalItems = $data->count();
              return successResponse($response, [
                  'list'=> $models,
                  'totalItems' => $totalItems
              ]);
});
?>