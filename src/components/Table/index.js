import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import api from '../../services/api';

const columns = [
  {
    id: 'id_feature',
    label: 'ID INV.',
    minWidth: 50,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'locator',
    label: 'LOCALIZADOR',
    minWidth: 70,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'first_ean',
    label: 'EAN 1º CONTAGEM',
    minWidth: 80,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'first_amount',
    label: 'QTD 1º CONTAGEM',
    minWidth: 40,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'first_user',
    label: 'USUÁRIO 1º CONTAGEM',
    minWidth: 80,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'second_ean',
    label: 'EAN 2º CONTAGEM',
    minWidth: 80,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'second_amount',
    label: 'QTD 2º CONTAGEM',
    minWidth: 50,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'second_user',
    label: 'USUÁRIO 2º CONTAGEM',
    minWidth: 50,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'third_ean',
    label: 'EAN 3º CONTAGEM',
    minWidth: 80,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'third_amount',
    label: 'QTD 3º CONTAGEM',
    minWidth: 40,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'third_user',
    label: 'USUÁRIO 3º CONTAGEM',
    minWidth: 70,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'fourth_ean',
    label: 'EAN 4º CONTAGEM',
    minWidth: 80,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'fourth_amount',
    label: 'QTD 4º CONTAGEM',
    minWidth: 40,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
  {
    id: 'fourth_user',
    label: 'USUÁRIO 4º CONTAGEM',
    minWidth: 70,
    align: 'center',
    format: value => value.toLocaleString('pt-BR'),
  },
];

// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 700,
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const profile = useSelector(state => state.user.profile);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    async function loadCounts() {
      const response = await api.get(`stat_counts/${profile.feature.id}`);

      setRows(response.data.listCounts);
    }

    loadCounts();
  }, []);

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
