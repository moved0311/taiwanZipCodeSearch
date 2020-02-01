import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var L: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  template: `<div id="map"></div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  map;
  zoom = 8;
  markers = new Array();
  layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  });
  ngOnInit(){
    this.map = new L.Map('map').setView([23.79037129915711, 120.95281938174952], this.zoom);
    this.map.addLayer(this.layer);
  }
  ngAfterViewInit(){
    let data = {latlng:'', pos:'', zipcode:''};
    let geocodeService = L.esri.Geocoding.geocodeService();
    
    this.map.on('click', function(e) {
      data.latlng = e.latlng;
      geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
        data.pos = result.address.Match_addr;
        let url = "http://zip5.5432.tw/zip5json.py?adrs=" + result.address.Match_addr;
        $.ajax({url: url, success: function(result){
          data.zipcode = result.zipcode;
        }}).then(function(){
          let popstr = "<b>地址 : </b>" + data.pos + "<br><b>郵遞區號 : </b>" + data.zipcode;
          let marker = new L.Marker(data.latlng);
          this.markers.push(marker);  // add to markers array.
          this.map.addLayer(marker);
          marker.bindPopup(popstr).openPopup();
          // console.log(data);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}
