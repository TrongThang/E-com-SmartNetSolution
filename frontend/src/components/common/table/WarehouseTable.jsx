import { useEffect, useState } from "react";
import addressBookApi from "@/apis/modules/address.api.ts";
import GenericTable from "@/components/common/GenericTable";
import ActionsColumn from './ActionsColumn';

const WarehouseTable = ({ warehouses, onEdit, onDelete }) => {
    const [provinceMap, setProvinceMap] = useState({});
    const [districtMap, setDistrictMap] = useState({});
    const [wardMap, setWardMap] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            setLoading(true);
            try {
                // 1. Lấy unique code
                const provinceCodes = [...new Set(warehouses.map(w => w.province).filter(Boolean))];
                const districtCodes = [...new Set(warehouses.map(w => w.district).filter(Boolean))];
                const wardCodes = [...new Set(warehouses.map(w => w.ward).filter(Boolean))];

                // 2. Lấy danh sách tỉnh
                const provinceRes = await addressBookApi.getCity();
                const provinceMapTemp = {};
                (provinceRes.data || []).forEach(p => {
                    if (provinceCodes.includes(String(p.ProvinceID)) || provinceCodes.includes(p.ProvinceID)) {
                        provinceMapTemp[String(p.ProvinceID)] = p.ProvinceName;
                    }
                });
                setProvinceMap(provinceMapTemp);

                // 3. Lấy danh sách quận cho từng tỉnh có trong kho
                let districtMapTemp = {};
                for (const provinceId of provinceCodes) {
                    const districtRes = await addressBookApi.getDistrict(provinceId);
                    (districtRes.data || []).forEach(d => {
                        if (districtCodes.includes(String(d.DistrictID)) || districtCodes.includes(d.DistrictID)) {
                            districtMapTemp[String(d.DistrictID)] = d.DistrictName;
                        }
                    });
                }
                setDistrictMap(districtMapTemp);

                // 4. Lấy danh sách phường cho từng quận có trong kho
                let wardMapTemp = {};
                for (const districtId of districtCodes) {
                    const wardRes = await addressBookApi.getWard(districtId);
                        
                    (wardRes.data || []).forEach(w => {
                        for (const wardCode of wardCodes) {
                            const found = (wardRes.data || []).find(w => String(w.WardCode) === String(wardCode));
                            if (found) {
                                wardMapTemp[String(found.WardCode)] = found.WardName;
                            }
                        }
                    });
                }
                setWardMap(wardMapTemp);

            } catch (err) {
                console.log(err);
            }
            setLoading(false);
        };
        if (warehouses.length > 0) fetchLocations();
    }, [warehouses]);

    const columns = [
        {
            key: "sst",
            label: "STT",
            render: (_row, index) => index + 1,
        },
        {
            key: "name",
            label: "Tên kho",
            sortName: "name"
        },
        {
            key: "address",
            label: "Địa chỉ",
            sortName: "address"
        },
        {
            key: "province",
            label: "Tỉnh/Thành phố",
            sortName: "province",
            render: (row) => provinceMap[String(row.province)] || row.province || "",
        },
        {
            key: "district",
            label: "Quận/Huyện",
            sortName: "district",
            render: (row) => districtMap[String(row.district)] || row.district || "",
        },
        {
            key: "ward",
            label: "Phường/Xã",
            sortName: "ward",
            render: (row) => wardMap[String(row.ward)] || row.ward || "",
        },
        {
            key: "created_at",
            label: "Ngày tạo",
            sortName: "created_at",
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "updated_at",
            label: "Ngày cập nhật",
            sortName: "updated_at",
            render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString('vi-VN') : '',
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <ActionsColumn
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        },
    ];

    return (
        <GenericTable
            data={warehouses}
            columns={columns}
            rowsPerPage={5}
            loading={loading}
        />
    );
};

export default WarehouseTable;