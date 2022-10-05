<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Support\Facades\View;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index()
    {
        return View::make('customer.index');
    }
    public function getCustomerAll(Request $request)
    {
        // if ($request->ajax()) {
            $customers = Customer::orderBy('lname', 'DESC')->get();
            return response()->json($customers);
        // }
    }
}
