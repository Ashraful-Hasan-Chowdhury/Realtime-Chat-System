<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/chat', 'ChatController@chat');
Route::post('/send', 'ChatController@send');
Route::post('/saveToSession','ChatController@saveToSession');
Route::post('/deleteSession','ChatController@deleteSession');
Route::post('/getOldMessage','ChatController@getOldMessage');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
