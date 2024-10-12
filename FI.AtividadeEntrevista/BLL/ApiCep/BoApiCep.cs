using FI.AtividadeEntrevista.DML;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL.ApiCep
{
    public class BoApiCep
    {
        //private const string URL = "https://api.brasilaberto.com/v1/";
        private const string URL = "https://viacep.com.br/ws/";

        public async Task<Endereco> BuscarEnderecoPorCEP(string cep)
        {
            try
            {
                Endereco endereco = new Endereco();

                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(URL);

                client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

                
                HttpResponseMessage response = await client.GetAsync($"{cep}/json/"); 
                if (response.IsSuccessStatusCode)
                {
                    var dataObjects = response.Content.ReadAsStringAsync().Result;

                    //JObject obj = JObject.Parse(dataObjects.Result);

                    //string resultJson = obj["result"].ToString();

                    endereco = JsonConvert.DeserializeObject<Endereco>(dataObjects.ToString());
                }
                else
                    throw new Exception($"Ocorreu um erro ao buscar Endereço.");
                
                
                client.Dispose();

                return endereco;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
    }
}
