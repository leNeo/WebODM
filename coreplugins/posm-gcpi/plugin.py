import json

from app.models import Basemap
from app.plugins import PluginBase, Menu, MountPoint
from django.shortcuts import render
from django.utils.translation import gettext as _
from django.contrib.auth.decorators import login_required

class Plugin(PluginBase):

    def main_menu(self):
        return [Menu(_("GCP Interface"), self.public_url(""), "fa fa-map-marker-alt fa-fw")]

    @staticmethod
    def get_gcpi_basemaps():
        basemaps = []
        for basemap in Basemap.get_cached_basemaps():
            item = dict(basemap)
            label = item.get('label', '').lower()
            url = item.get('url', '').lower()
            if 'swisstopo' in label or 'geo.admin.ch' in url:
                item['gcpProjection'] = 'EPSG:2056'
            basemaps.append(item)
        return basemaps

    def app_mount_points(self):
        @login_required
        def gcpi(request):
            return render(request, self.template_path("app.html"), {
                'title': 'GCP Editor',
                'gcpi_config': json.dumps({
                    'basemaps': self.get_gcpi_basemaps(),
                }),
            })

        return [
            MountPoint('$', gcpi)
        ]
