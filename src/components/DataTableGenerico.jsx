import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

const DataTableGenerico = ({
  data,
  columns,
  globalFilter,
  onGlobalFilterChange,
  actions,
}) => {
  const onGlobalFilterChangeFunction =
    typeof onGlobalFilterChange === "function"
      ? (e) => onGlobalFilterChange(e.target.value)
      : () => {};
  return (
    <div className="card space-y-12 mt-12">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          onInput={onGlobalFilterChangeFunction}
          placeholder="Buscar..."
          className="w-full"
        />
      </IconField>
      <DataTable
        value={data}
        rows={5}
        paginator
        tableStyle={{ minWidth: "50rem" }}
        globalFilter={globalFilter}
        rowsPerPageOptions={[5, 10, 20]}
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        emptyMessage="No se encontraron registros"
      >
        {Array.isArray(columns) &&
          columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              sortable={col.sortable}
              body={(rowData) => (
                <span data-testid={`table-cell-${col.field}-${rowData.id}`}>
                  {col.body ? col.body(rowData) : rowData[col.field]}
                </span>
              )}
              style={col.style}
            />
          ))}
        {actions && (
          <Column body={actions} header="" style={{ width: "10rem" }} />
        )}
      </DataTable>
    </div>
  );
};
export default DataTableGenerico;
