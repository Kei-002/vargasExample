//customer/index.blade.php
@extends('layouts.base')
@section('body')
    <div class="container">
        <a href="{{ route('customer.create') }}" class="btn btn-primary a-btn-slide-text">
            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
            <span><strong>ADD</strong></span>
        </a>
        @if ($message = Session::get('success'))
            <div class="alert alert-success alert-block">
                <button type="button" class="close" data-dismiss="alert">Ã—</button>
                <strong>{{ $message }}</strong>
            </div>
        @endif
        <a href="{{ Auth::logout() }}">Logout</a>
        <div id="ctable" class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Customer ID</th>
                        <th>Title</th>
                        <th>lname</th>
                        <th>fname</th>
                        <th>address</th>
                        <th>phone</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Restore</th>
                    </tr>
                </thead>
                <tbody id="cbody">
                </tbody>
            </table>
        </div>
    </div>
    @endsection
